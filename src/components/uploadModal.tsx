"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

export const UploadModal = () => {
  const [link, setLink] = useState("");

  const handleSubmit = () => {
    if (!link) return;
    console.log("Submitted link:", link);
    setLink("");
  };

  return (
    <Dialog>
      {/* Trigger Button */}
      <DialogTrigger asChild>
            <Button
              className="
                flex items-center justify-center gap-2
                bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
                text-white font-semibold rounded-lg shadow-md transition-all
                px-4 py-2
                sm:px-5 sm:py-2.5
              "
        >
              {/* Mobile: icon only */}
              <span className="block sm:hidden
        text-white bg-clip-text
        bg-gradient-to-r from-purple-600 to-pink-600
        font-bold text-2xl leading-none">&#10010;</span>

              {/* Desktop: text label */}
              <span className="hidden sm:inline
        text-white bg-clip-text
        bg-gradient-to-r from-purple-600 to-pink-600
        font-bold">Upload</span>
            </Button>
        </DialogTrigger>


      {/* Modal Content */}
      <DialogContent
        className="
          flex flex-col
          justify-center items-center
          fixed
          z-50
          bg-black/40 backdrop-blur-sm
          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          data-[state=open]:fade-in-0
          data-[state=closed]:fade-out-0
        "
      >
        {/* Inner Modal Box */}
        <div
          className="
            w-[90%] sm:w-1/2 max-w-lg
            bg-white dark:bg-gray-900
            rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700
            overflow-hidden
            transition-all
          "
        >
          {/* Header */}
          <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-700 text-center">
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Submit Link
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-1">
              Paste your link below to upload or share.
            </DialogDescription>
          </DialogHeader>

          {/* Body */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="https://example.com"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="
                w-full px-4 py-2
                border border-gray-300 dark:border-gray-600
                rounded-md
                focus:outline-none
                focus:ring-2 focus:ring-purple-500
                dark:bg-gray-800 dark:text-white
                placeholder-gray-400 dark:placeholder-gray-500
                transition-all
              "
            />
          </div>

          {/* Footer */}
          <DialogFooter className="p-6 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
            <DialogClose asChild>
              <Button
                variant="secondary"
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              onClick={handleSubmit}
              disabled={!link}
              className="
                px-4 py-2
                rounded-md
                font-semibold
                text-white
                bg-gradient-to-r from-purple-600 to-pink-600
                hover:from-purple-700 hover:to-pink-700
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-md
                transition-all
              "
            >
              Submit
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
