"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";

export function CreateForumModal({ onForumCreated }) {
  const [open, setOpen] = useState(false);
  const [newForum, setNewForum] = useState({
    title: "",
    description: "",
    bounty: 0,
  });

  async function createForum() {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/forums`,
        newForum,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Forum created successfully!");
      setNewForum({ title: "", description: "", bounty: 0 }); // Reset form
      setOpen(false);
      onForumCreated(); // Refresh the list of forums
    } catch (error) {
      console.log(error);
      toast.error("Failed to create forum");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Forum</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Forum</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={newForum.title}
              onChange={(e) =>
                setNewForum({ ...newForum, title: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={newForum.description}
              onChange={(e) =>
                setNewForum({ ...newForum, description: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bounty" className="text-right">
              Bounty
            </Label>
            <Input
              id="bounty"
              type="number"
              value={newForum.bounty}
              onChange={(e) =>
                setNewForum({ ...newForum, bounty: Number(e.target.value) })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={createForum}>Create Forum</Button>
      </DialogContent>
    </Dialog>
  );
}
