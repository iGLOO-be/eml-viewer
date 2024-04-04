"use client";

import prettyBytes from "pretty-bytes";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

type Attachment = {
  content: string;
  filename?: string;
  size: number;
};

const truncateFilename = (filename: string, { left = 20, right = 15 } = {}) => {
  if (filename.length <= left + right) return filename;
  const ext = filename.split(".").pop();
  const name = filename.slice(0, left);
  const last = filename.split(".").slice(0, -1).join(".").slice(-right);
  return `${name}...${last}.${ext}`;
};

export const AttachmentList = ({
  attachments,
}: {
  attachments: Attachment[];
}) => {
  const maxAttachments = 5;
  const [showAll, setShowAll] = useState(false);
  if (attachments.length === 0) return null;

  const attachmentsCount = attachments.length;

  if (!showAll) {
    attachments = attachments.slice(0, maxAttachments);
  }

  return (
    <ul className="pb-2">
      {attachments.map((attachment, i) => (
        <li key={i} className="pr-2 inline-block truncate">
          <Badge className="hover:underline" variant="outline">
            <a
              href={`data:application/octet-stream;base64,${attachment.content}`}
              download={attachment.filename}
              title={attachment.filename}
            >
              {truncateFilename(attachment.filename || "No filename")} (
              {prettyBytes(attachment.size)})
            </a>
          </Badge>
        </li>
      ))}
      {attachmentsCount > maxAttachments && (
        <li className="pr-2 inline-block truncate">
          <Badge
            className="hover:underline cursor-pointer"
            variant="secondary"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Less" : "..."}
          </Badge>
        </li>
      )}
    </ul>
  );
};
