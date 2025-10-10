"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Bell, Shield, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AccountSettings() {
  const [activeTab, setActiveTab] = useState("profile")

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "January 2023",
  }

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-64 flex-shrink-0"
        >
          <div className="glassmorphism rounded-2xl p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">Member since {user.joinDate}</p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("profile")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("notifications")}>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("security")}>
                <Shield className="mr-2 h-4 w-4" />
                Security
              </Button>
            </div>

            <Separator className="my-4" />

            <Button variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </motion.div>

        {/* Main content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
          <div className="glassmorphism rounded-2xl p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user.name} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <Button className="w-fit">Save Changes</Button>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="task-reminders">Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminders for upcoming tasks</p>
                    </div>
                    <Switch id="task-reminders" defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="exam-alerts">Exam Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts for upcoming exams</p>
                    </div>
                    <Switch id="exam-alerts" defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="study-suggestions">Study Suggestions</Label>
                      <p className="text-sm text-muted-foreground">Get AI-powered study suggestions</p>
                    </div>
                    <Switch id="study-suggestions" />
                  </div>

                  <Button className="w-fit">Save Preferences</Button>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <h2 className="text-xl font-semibold">Security Settings</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>

                      <Button className="w-fit">Update Password</Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa">Enable 2FA</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch id="2fa" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Sessions</h3>
                    <Button variant="outline" className="w-fit">
                      Sign Out of All Devices
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
