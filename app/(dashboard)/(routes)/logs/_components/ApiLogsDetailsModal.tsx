"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Toaster, toast } from "sonner";
import Download from "@/components/svg Icons/Download";
import { useState } from "react";

interface ApiLog {
  sN: number;
  id: string;
  merchantPrefix: string;
  requestTimestamp: string;
  responseTimestamp: string;
  service: string;
  responseStatus: number;
  createdAt: string;
  // Modal compatibility fields
  logId: string;
  merchantCode: string;
  timestamp: string;
  user: string;
  email: string;
  transactionReference: string;
  customerReference: string;
  clientIP: string;
  requestPayload: string;
  responseBody: string;
}

interface ApiLogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: ApiLog | null;
  setSelectedLog: (log: ApiLog | null) => void;
  logs: ApiLog[];
}

export default function ApiLogDetailsModal({
  isOpen,
  onClose,
  log,
  setSelectedLog,
  logs,
}: ApiLogDetailsModalProps) {
  const [isPayloadOpen, setIsPayloadOpen] = useState(false);
  const [isResponseOpen, setIsResponseOpen] = useState(false);

  if (!log || !isOpen) return null;

  const getInitials = (name: string) => {
    if (!name || name === "System User") {
      return "SY";
    }
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
  };

  const currentIndex = logs.findIndex((l) => l.logId === log.logId);
  const prevLog = currentIndex > 0 ? logs[currentIndex - 1] : null;
  const nextLog = currentIndex < logs.length - 1 ? logs[currentIndex + 1] : null;

  const handlePrev = () => {
    if (prevLog) {
      setSelectedLog(prevLog);
    }
  };

  const handleNext = () => {
    if (nextLog) {
      setSelectedLog(nextLog);
    }
  };

  const handleExportDetails = async () => {
    try {
      // Create export data
      const exportData = {
        logId: log.logId,
        merchantPrefix: log.merchantPrefix,
        service: log.service,
        requestTimestamp: log.requestTimestamp,
        responseTimestamp: log.responseTimestamp,
        responseStatus: log.responseStatus,
        createdAt: log.createdAt,
        exportedAt: new Date().toISOString(),
      };

      // Create downloadable content
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `api_log_${log.logId}_${new Date().getTime()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success(`Export successful for Log ID ${log.logId}`);
    } catch (error) {
      toast.error("Export failed. Please try again later.");
      console.error(error);
    }
  };

  // Generate mock request payload for demonstration
  const generateMockRequestPayload = () => {
    return JSON.stringify({
      merchantId: log.merchantPrefix,
      service: log.service,
      timestamp: log.requestTimestamp,
      requestId: log.logId,
      parameters: {
        action: "process_request",
        version: "1.0"
      }
    }, null, 2);
  };

  // Generate mock response body for demonstration
  const generateMockResponseBody = () => {
    return JSON.stringify({
      status: log.responseStatus >= 200 && log.responseStatus < 300 ? "success" : "error",
      statusCode: log.responseStatus,
      timestamp: log.responseTimestamp,
      data: log.responseStatus >= 200 && log.responseStatus < 300 ? {
        message: "Request processed successfully",
        transactionId: log.logId
      } : {
        error: "Request processing failed",
        errorCode: log.responseStatus
      }
    }, null, 2);
  };

  return (
    <div className="fixed inset-0 z-[50] flex justify-end my-3 mr-3">
      <div
        className="fixed inset-0 bg-[#140000B2] backdrop-blur-xs dark:bg-black/50"
        onClick={onClose}
      />
      <div
        className="h-full w-[45%] bg-background shadow-lg overflow-x-auto transform transition-transform duration-300 ease-in-out rounded-xl"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-[#F8F8F8] dark:border-[#2A2A2A]">
            <div className="flex flex-col gap-0">
              <h2 className="text-sm font-semibold">API Log Details</h2>
              <p className="text-xs text-gray-500 mb-4">Get complete oversight on platform operations</p>
            </div>
            <div>
              <Button variant="ghost" className="p-0 h-auto" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between border-b border-[#F8F8F8] dark:border-[#2A2A2A] py-3">
            <span className="text-red-500 font-medium text-sm">
              Log ID: <span className="text-primary text-sm font-light">{log.logId}</span>
            </span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={handlePrev} disabled={!prevLog}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext} disabled={!nextLog}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Summary Section */}
          <div className="space-y-4 py-3">
            <h3 className="text-xs text-gray-500">Summary Section</h3>
            <div className="flex items-center justify-between space-x-1 pb-5 border-b border-[#F8F8F8] dark:border-[#2A2A2A]">
              <div className="flex items-center gap-2">
                <Avatar className="w-13 h-13">
                  <AvatarImage src="/images/avatar-placeholder.jpg" alt="System Avatar" />
                  <AvatarFallback>{getInitials(log.user)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{log.merchantPrefix || "System"}</p>
                  <p className="text-xs text-gray-500">{log.service || "API Service"}</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Button className="hover:bg-red-600 ml-auto">View Merchant</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="bg-[#F5F5F5] dark:bg-card rounded-sm">
                      <BsThreeDots />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleExportDetails}>
                      <Download /> Export Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex justify-between text-sm border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-1">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Merchant Code</span>
                <span>{log.merchantPrefix || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Response Status</span>
                <span 
                  style={{ 
                    color: log.responseStatus >= 200 && log.responseStatus < 300 ? "#4CAF50" : 
                           log.responseStatus >= 400 && log.responseStatus < 500 ? "#FF8C00" : 
                           log.responseStatus >= 500 ? "#FF4444" : "#000000" 
                  }}
                >
                  {log.responseStatus}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Service</span>
                <span>{log.service || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Request Timestamp</span>
                <span>{log.requestTimestamp}</span>
              </div>
            </div>
          </div>

          {/* Log Details */}
          <div className="space-y-4">
            <h3 className="text-xs text-gray-500">Log Details</h3>
            <div className="flex flex-col gap-4 text-sm">
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Response Timestamp:</p>
                <p>{log.responseTimestamp}</p>
              </span>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Service Type:</p>
                <span>{log.service || "API Service"}</span>
              </span>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Status Code:</p>
                <span 
                  style={{ 
                    color: log.responseStatus >= 200 && log.responseStatus < 300 ? "#4CAF50" : 
                           log.responseStatus >= 400 && log.responseStatus < 500 ? "#FF8C00" : 
                           log.responseStatus >= 500 ? "#FF4444" : "#000000" 
                  }}
                >
                  {log.responseStatus} - {
                    log.responseStatus >= 200 && log.responseStatus < 300 ? "Success" :
                    log.responseStatus >= 400 && log.responseStatus < 500 ? "Client Error" :
                    log.responseStatus >= 500 ? "Server Error" : "Unknown"
                  }
                </span>
              </span>
            </div>
          </div>

          {/* Additional Metadata */}
          <div className="space-y-4 mt-6">
            <h3 className="text-xs text-gray-500">Request/Response Data</h3>
            <div className="flex flex-col gap-4 text-sm">
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Log ID:</p>
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {log.logId}
                </span>
              </span>
              
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-normal pl-3 pr-10 py-2 border rounded-md text-sm bg-[#F8F8F8] dark:bg-gray-700"
                  onClick={() => setIsPayloadOpen(!isPayloadOpen)}
                >
                  <span>Request Payload</span>
                  <span className="ml-auto">{isPayloadOpen ? "▼" : "▶"}</span>
                </Button>
                {isPayloadOpen && (
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto border">
                    {log.requestPayload || generateMockRequestPayload()}
                  </pre>
                )}
              </div>
              
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-normal pl-3 pr-10 py-2 border rounded-md text-sm bg-[#F8F8F8] dark:bg-gray-700"
                  onClick={() => setIsResponseOpen(!isResponseOpen)}
                >
                  <span>Response Body</span>
                  <span className="ml-auto">{isResponseOpen ? "▼" : "▶"}</span>
                </Button>
                {isResponseOpen && (
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto border">
                    {log.responseBody || generateMockResponseBody()}
                  </pre>
                )}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4 mt-6">
            <h3 className="text-xs text-gray-500">Performance Metrics</h3>
            <div className="flex flex-col gap-4 text-sm">
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Processing Time:</p>
                <span>
                  {log.requestTimestamp && log.responseTimestamp ? 
                    `${Math.abs(new Date(log.responseTimestamp).getTime() - new Date(log.requestTimestamp).getTime())}ms` : 
                    "N/A"
                  }
                </span>
              </span>
              <span className="flex gap-2 border-b border-[#F8F8F8] dark:border-[#2A2A2A] pb-2">
                <p className="font-medium">Request Method:</p>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                  {log.service?.includes("GET") ? "GET" : 
                   log.service?.includes("POST") ? "POST" : 
                   log.service?.includes("PUT") ? "PUT" : 
                   log.service?.includes("DELETE") ? "DELETE" : "API"}
                </span>
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 text-sm space-y-4">
            <h3 className="text-gray-500 text-xs">Footer</h3>
            <div>
              <span className="flex gap-2">
                <p className="font-medium">Last Updated:</p>
                <span>{log.createdAt}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}