"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Security() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe A.",
    role: "Super Admin",
    avatar: "/placeholder-avatar.jpg",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (e:any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-center space-x-4 mb-4 relative">
        <div className="relative">
          <img
            src={formData.avatar}
            alt="User Avatar"
            className="w-16 h-16 rounded-full"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="avatar-upload"
          />

          <div className="mt-2">
          <p className="font-medium text-sm">{formData.name}</p>
          <p className="text-red-600 text-xs">{formData.role}</p>
        </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* <div>
          <Label className="text-sm text-gray-500">Current Password</Label>
          <Input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>
        <div></div> Empty div for alignment */}
        <div>
          <Label className="text-sm text-gray-500">New Password</Label>
          <Input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm text-gray-500">Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>
      </div>
      <div className="flex justify-end mt-6">
      <Button
        onClick={handleEditToggle}
        className="mt-4 flex items-center justify-center"
      >
        {isEditing ? "Save Changes" : "Edit Password"}
      </Button>
      </div>
    </div>
  );
}