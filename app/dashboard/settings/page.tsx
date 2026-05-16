"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { userApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { User, Lock } from "lucide-react"
import { PageMeta } from "@/components/page-meta"

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth()
  const [email, setEmail] = useState(user?.email || "")
  const [profileLoading, setProfileLoading] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setProfileLoading(true)
    try {
      await userApi.update(user.id, { id: user.id, email })
      await refreshUser()
      toast.success("Profile updated! Please sign in again.")
      logout()
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile")
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setPasswordLoading(true)
    try {
      await userApi.updatePassword({ oldPassword, newPassword })
      toast.success("Password changed successfully!")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      toast.error(err.message || "Failed to change password")
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <PageMeta title="Dashboard — Settings" description="Manage your hrva.cc account settings and password." />
      <div className="space-y-1">
        <h1 className="text-2xl font-display tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings</p>
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-display tracking-tight">Profile</CardTitle>
              <CardDescription className="text-xs">Update your email address</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-10 bg-background/50 border-border/50" />
            </div>
            <Button type="submit" disabled={profileLoading} className="h-9 text-xs bg-primary text-primary-foreground hover:brightness-110" size="sm">
              {profileLoading ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/40">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary">
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-display tracking-tight">Change Password</CardTitle>
              <CardDescription className="text-xs">Update your account password</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="oldPassword" className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Current Password</Label>
              <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="h-10 bg-background/50 border-border/50" />
            </div>
            <Separator className="bg-border/30" />
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-xs font-medium text-muted-foreground tracking-wide uppercase">New Password</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="h-10 bg-background/50 border-border/50" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="h-10 bg-background/50 border-border/50" />
            </div>
            <Button type="submit" disabled={passwordLoading} className="h-9 text-xs bg-primary text-primary-foreground hover:brightness-110" size="sm">
              {passwordLoading ? "Changing…" : "Change password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
