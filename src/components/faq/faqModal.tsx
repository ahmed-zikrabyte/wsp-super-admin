"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FAQModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    question: string;
    answer: string;
  };
}

const FAQModal: React.FC<FAQModalProps> = ({ open, onOpenChange, data }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            FAQ Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Question */}
          <div>
            <p className="text-sm font-medium text-gray-500">Question</p>
            <p className="mt-1 text-base font-semibold text-gray-800">
              {data.question}
            </p>
          </div>

          {/* Answer */}
          <div>
            <p className="text-sm font-medium text-gray-500">Answer</p>
            <ScrollArea className="max-h-60 mt-1 rounded-md bg-gray-50 p-3">
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {data.answer}
              </p>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FAQModal;
