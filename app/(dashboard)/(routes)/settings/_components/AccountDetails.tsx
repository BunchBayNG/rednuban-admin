"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { TbEdit } from "react-icons/tb";

export default function AccountDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@redpay.com",
    phone: "08167889345",
    role: "Super Admin",
    status: "Enabled",
    avatar: "/placeholder-avatar.jpg",
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
         <Camera  className="w-6 h-6 text-white absolute top-0 right-0 bg-red-600 rounded-full p-1 cursor-pointer"/>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-500">First Name</Label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm text-gray-500">Last Name</Label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm text-gray-500">Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm text-gray-500">Phone</Label>
          <Input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm text-gray-500">Role</Label>
          <Input
            type="text"
            value={formData.role}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label className="text-sm text-gray-500">Status</Label>
          <Input
            type="text"
            value={formData.status}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="flex justify-end  mt-6">
      <Button
        onClick={handleEditToggle}
        className="mt-4 bg-red-600 text-white flex items-center justify-center"
      >
       <TbEdit/>
        {isEditing ? "Save Changes" : "Edit Account Details"}
      </Button>
      </div>
    </div>
  );
}