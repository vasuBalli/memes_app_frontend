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
    setLink(""); // reset input
    // optionally close modal after submit
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="hidden sm:flex gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          Upload
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Submit Link
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-1">
              Paste your link below.
            </DialogDescription>
          </DialogHeader>

          <input
            type="text"
            placeholder="Paste your link here"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="mt-4 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />

          <DialogFooter className="mt-6 w-full flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button variant="default" onClick={handleSubmit} disabled={!link}>
              Submit
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
