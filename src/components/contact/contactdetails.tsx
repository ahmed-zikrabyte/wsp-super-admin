import { CalendarIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Contact } from "@/services/contactServices";

interface ContactDetailsModalProps {
  contact: Contact;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDetailsModal({
  contact,
  open,
  onOpenChange,
}: ContactDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Contact Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Detailed information about the contact inquiry.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Contact Information */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-muted-foreground">
                    Name
                  </div>
                  <div className="text-base font-semibold">{contact.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                  <MailIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-muted-foreground">
                    Email
                  </div>
                  <div className="text-base font-semibold break-all">
                    {contact.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                  <PhoneIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-muted-foreground">
                    Phone
                  </div>
                  <div className="text-base font-semibold">{contact.phone}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-muted-foreground">
                    Submitted On
                  </div>
                  <div className="text-base font-semibold">
                    {moment(contact.createdAt).format("DD-MM-YYYY HH:mm")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Message */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-muted/20 border-l-4 border-blue-500">
                <div className="text-base leading-relaxed whitespace-pre-wrap">
                  {contact.message}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom spacing */}
          <div className="h-4" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
