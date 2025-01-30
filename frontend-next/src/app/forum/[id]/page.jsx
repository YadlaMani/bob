"use client";

import { useState, useEffect } from "react";
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
import jsPDF from "jspdf"; // Import jsPDF
import { saveAs } from "file-saver";

export default function ForumPage() {
  const { id } = useParams();
  const [forum, setForum] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [giftAmount, setGiftAmount] = useState(0);

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

  async function forumAction() {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/forums/${id}/action`
      );
      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
    }
  }

  const generateJSONReport = () => {
    const jsonData = JSON.stringify(forum, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    saveAs(blob, `Forum_Report_${forum.title}.json`);
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();

    // Set default font and size
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Add title with styling
    doc.setFontSize(24);
    doc.setTextColor(33, 37, 41); // Dark gray color
    doc.text(`Forum: ${forum.title}`, 14, 20);

    // Add description with styling
    doc.setFontSize(16);
    doc.setTextColor(52, 58, 64); // Slightly lighter gray
    doc.text("Description:", 14, 30);
    doc.setFontSize(12);
    doc.setTextColor(73, 80, 87); // Even lighter gray
    const splitDescription = doc.splitTextToSize(forum.description, 180);
    doc.text(splitDescription, 14, 40);

    // Add a horizontal line separator
    doc.setDrawColor(200, 200, 200); // Light gray color
    doc.line(14, 50, 200, 50); // Draw a line from (x1, y1) to (x2, y2)

    // Add comments section with styling
    doc.setFontSize(18);
    doc.setTextColor(33, 37, 41); // Dark gray color
    doc.text("Comments", 14, 60);

    let startY = 70; // Starting Y position for the first comment

    // Loop through comments and add their content to the PDF
    forum.comments.forEach((comment, index) => {
      doc.setFontSize(14);
      doc.setTextColor(52, 58, 64); // Slightly lighter gray
      doc.text(`Comment ${index + 1}:`, 14, startY);

      // Add comment content with a different color and indentation
      doc.setFontSize(12);
      doc.setTextColor(73, 80, 87); // Even lighter gray
      const splitContent = doc.splitTextToSize(comment.content, 170);
      doc.text(splitContent, 20, startY + 5);

      // Add comment metadata
      doc.setFontSize(10);
      doc.setTextColor(108, 117, 125); // Light gray for metadata
      doc.text(
        `By: ${comment.username} | Date: ${new Date(
          comment.createdAt
        ).toLocaleString()}`,
        20,
        startY + 5 + splitContent.length * 5
      );

      // Add a small separator line between comments
      doc.setDrawColor(200, 200, 200); // Light gray color
      doc.line(
        14,
        startY + 15 + splitContent.length * 5,
        200,
        startY + 15 + splitContent.length * 5
      );

      startY += 20 + splitContent.length * 5; // Adjust spacing for the next comment

      // Check if we need a new page
      if (startY > 280) {
        doc.addPage();
        startY = 20;
      }
    });

    // Save the PDF
    doc.save(`Forum_Report_${forum.title}.pdf`);
  };

  if (!forum) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{forum.title}</CardTitle>
          <div className="text-sm text-gray-500">
            Created on {new Date(forum.createdAt).toLocaleDateString()}
          </div>
          <div className="flex space-x-2 mt-2">
            <Button onClick={generatePDFReport} className="mt-2">
              Download as PDF
            </Button>
            <Button onClick={generateJSONReport} className="mt-2">
              Download as JSON
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{forum.description}</p>
          <div className="flex justify-between items-center">
            <span className="font-bold">Bounty: ${forum.bounty}</span>
            <Button
              className={
                forum.status === "closed" ? "opacity-50 cursor-not-allowed" : ""
              }
              disabled={forum.status === "closed"}
              onClick={() => {
                if (forum.status === "open") {
                  setIsCommentModalOpen(true);
                }
              }}
            >
              {forum.status === "open" ? "Add Comment" : "This forum is closed"}
            </Button>
            {currUser && forum.userId === currUser._id && (
              <Button onClick={forumAction}>
                {forum.status == "open" ? "Close Forum" : "Open Forum"}
              </Button>
            )}
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

      <Dialog open={isGiftModalOpen} onOpenChange={setIsGiftModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gift Sol to Comment</DialogTitle>
          </DialogHeader>
          <p>How much Sol would you like to gift to this comment?</p>
          <input
            type="number"
            value={giftAmount}
            onChange={(e) => setGiftAmount(Number.parseFloat(e.target.value))}
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
