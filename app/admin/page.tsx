"use client"

import { useState, useEffect } from "react"
import { useAllUsers, useUpdateUser, useDeleteUser } from "@/lib/hooks/useUsers"
import { usePagination } from "@/lib/hooks/usePagination"
import { Pagination } from "@/components/ui/pagination"
import type { User, UserFilters } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Edit, Trash2, ToggleLeft, ToggleRight, Shield, Search } from "lucide-react"
import { toast } from "sonner"
import { formatDate, formatDateTime } from "@/lib/utils"
import { PageMeta } from "@/components/page-meta"

export default function AdminUsersPage() {
  const { page, size, setPage, setSize } = usePagination()
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  useEffect(() => { setPage(0) }, [search, activeFilter])
  const filterKey = `${search}-${activeFilter}`
  const filters: UserFilters = {
    search: search || undefined,
    active: activeFilter === "all" ? undefined : activeFilter === "active",
  }
  const { data: users, isLoading, error } = useAllUsers(filters, page, size)
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editEmail, setEditEmail] = useState("")
  const [editSlots, setEditSlots] = useState("")

  const handleEdit = (user: User) => {
    setEditUser(user)
    setEditEmail(user.email)
    setEditSlots(user.apiKeySlots.toString())
  }

  const handleEditSave = async () => {
    if (!editUser) return
    try {
      await updateUser.mutateAsync({
        id: editUser.id,
        data: {
          id: editUser.id,
          email: editEmail,
          apiKeySlots: parseInt(editSlots) || editUser.apiKeySlots,
          active: editUser.active,
        },
      })
      toast.success("User updated")
      setEditUser(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to update user")
    }
  }

  const handleToggleActive = async (user: User) => {
    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: {
          id: user.id,
          active: !user.active,
        },
      })
      toast.success(user.active ? "User deactivated" : "User activated")
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle user status")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteUser.mutateAsync(id)
      toast.success("User deleted permanently")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user")
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
                <Label>Email</Label>
                <Input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  disabled={!!(editUser?.authProvider && editUser.authProvider !== "local")}
                />
                {editUser?.authProvider && editUser.authProvider !== "local" && (
                  <p className="text-[11px] text-muted-foreground">
                    Email is managed by {editUser.authProvider === "google" ? "Google" : "GitHub"}. Cannot be changed here.
                  </p>
                )}
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-sm"
          />
        </div>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

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
      ) : !users || !users.content || users.content.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
          </CardContent>
        </Card>
      ) : (
        <Card key={filterKey}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden lg:table-cell">ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead className="hidden lg:table-cell">Slots</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.content?.map((user: User, i: number) => (
                  <TableRow key={user.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                    <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.authProvider && user.authProvider !== "local" ? "secondary" : "outline"} className="text-xs">
                        {user.authProvider === "google" ? "Google" : user.authProvider === "github" ? "GitHub" : "Email"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{user.apiKeySlots}</TableCell>
                    <TableCell className="text-sm text-muted-foreground" title={formatDateTime(user.createDate)}>{formatDate(user.createDate)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden lg:table-cell" title={formatDateTime(user.lastLogin)}>{formatDate(user.lastLogin)}</TableCell>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(user)}
                          disabled={updateUser.isPending}
                          title={user.active ? "Deactivate user" : "Activate user"}
                        >
                          {user.active
                            ? <ToggleRight className="h-4 w-4 text-success" />
                            : <ToggleLeft className="h-4 w-4 text-destructive" />
                          }
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete user?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently delete {user.email}. This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-destructive">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            <Pagination
              page={page}
              totalPages={users?.totalPages ?? 0}
              totalElements={users?.totalElements}
              size={size}
              onPageChange={setPage}
              onSizeChange={setSize}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
