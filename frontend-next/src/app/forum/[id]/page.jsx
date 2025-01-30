"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function ForumPage() {
  const { id } = useParams();
  const [forum, setForum] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [giftAmount, setGiftAmount] = useState(0); // Store the gift amount

  useEffect(() => {
    fetchForum();
    fetchUser();
  }, []);

  async function fetchForum() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/forums/${id}`
      );
      setForum(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load forum details");
    }
  }

  async function fetchUser() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCurrUser(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  }

  async function addComment() {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/forums/${id}/comments`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Comment added successfully!");
      setNewComment("");
      setIsCommentModalOpen(false);
      fetchForum();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    }
  }

  function openGiftModal(commentId) {
    setSelectedCommentId(commentId);
    setIsGiftModalOpen(true);
  }

  async function handleGiftSol() {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/forums/${id}/comments/${selectedCommentId}/gift`,
        { amount: giftAmount },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(response.data.message);
      setIsGiftModalOpen(false);
      fetchForum();
    } catch (err) {
      console.log(err);
      toast.error("Failed to gift SOL");
    }
  }

  if (!forum) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{forum.title}</CardTitle>
          <div className="text-sm text-gray-500">
            Created by {forum.userId.name} on{" "}
            {new Date(forum.createdAt).toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{forum.description}</p>
          <div className="flex justify-between items-center">
            <span className="font-bold">Bounty: ${forum.bounty}</span>
            <Button onClick={() => setIsCommentModalOpen(true)}>
              Add Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {forum.comments.length > 0 ? (
        forum.comments.map((comment) => (
          <Card key={comment._id} className="mb-4">
            <CardContent className="flex items-start space-x-4 pt-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <Link href={`/profile/${comment.userId}`}>
                    <span className="font-semibold">{comment.username}</span>
                  </Link>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p>{comment.content}</p>
                <p>
                  Bounty recieved:{Number(comment.recievedBounty.toFixed(2))}
                </p>

                <div className="flex items-center space-x-2 mt-2">
                  <Button variant="outline" size="sm">
                    👍 {comment.upvotes}
                  </Button>
                  <Button variant="outline" size="sm">
                    👎 {comment.downvotes}
                  </Button>
                </div>
                {currUser &&
                  comment.userId !== forum.userId &&
                  forum.userId === currUser._id && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        size="sm"
                        onClick={() => openGiftModal(comment._id)}
                      >
                        Gift Sol
                      </Button>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No comments yet.</p>
      )}

      <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Comment</DialogTitle>
          </DialogHeader>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            className="min-h-[100px]"
          />
          <Button onClick={addComment}>Submit Comment</Button>
        </DialogContent>
      </Dialog>

      {/* Gift Sol Modal */}
      <Dialog open={isGiftModalOpen} onOpenChange={setIsGiftModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gift Sol to Comment</DialogTitle>
          </DialogHeader>
          <p>How much Sol would you like to gift to this comment?</p>
          <input
            type="number"
            value={giftAmount}
            onChange={(e) => setGiftAmount(parseFloat(e.target.value))}
            min="0"
            max={forum.bounty}
            className="border p-2 rounded w-full mb-4 dark:text-black"
            placeholder={`Max: ${forum.bounty}`}
          />
          <div className="flex space-x-2">
            <Button onClick={handleGiftSol}>Confirm Gift</Button>
            <Button variant="outline" onClick={() => setIsGiftModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
