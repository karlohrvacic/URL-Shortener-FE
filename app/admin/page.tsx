"use client"

import { useState } from "react"
import { useAllUsers, useUpdateUser, useDeleteUser } from "@/lib/hooks/useUsers"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, ShieldAlert, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"
import { PageMeta } from "@/components/page-meta"

export default function AdminUsersPage() {
  const { data: users, isLoading, error } = useAllUsers()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editSlots, setEditSlots] = useState("")

  const handleEdit = (user: User) => {
    setEditUser(user)
    setEditName(user.name || "")
    setEditEmail(user.email)
    setEditSlots(user.apiKeySlots.toString())
  }

  const handleEditSave = async () => {
    if (!editUser) return
    try {
      await updateUser.mutateAsync({
        id: editUser.id,
        name: editName,
        email: editEmail,
        apiKeySlots: parseInt(editSlots) || editUser.apiKeySlots,
      })
      toast.success("User updated")
      setEditUser(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to update user")
    }
  }

  const handleDeactivate = async (id: number) => {
    try {
      await deleteUser.mutateAsync(id)
      toast.success("User deactivated")
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate user")
    }
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Admin — Users" description="Manage all registered users on hrva.cc." />
      <div>
        <h1 className="text-2xl font-display tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">Manage all registered users</p>
      </div>

      <Dialog open={!!editUser} onOpenChange={(open) => { if (!open) setEditUser(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>API Key Slots</Label>
                <Input type="number" value={editSlots} onChange={(e) => setEditSlots(e.target.value)} />
              </div>
              <Button onClick={handleEditSave} disabled={updateUser.isPending} className="w-full">
                {updateUser.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Failed to load users</p>
            <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>API Key Slots</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-sm text-muted-foreground">{user.id}</TableCell>
                    <TableCell>{user.name || "\u2014"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.apiKeySlots}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(user.createDate)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(user.lastLogin)}</TableCell>
                    <TableCell>
                      <Badge variant={user.active ? "success" : "destructive"}>
                        {user.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.active && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Deactivate user?</AlertDialogTitle>
                                <AlertDialogDescription>This will deactivate {user.email}. They will not be able to log in.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeactivate(user.id)} className="bg-destructive">Deactivate</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
