import type { IconName } from "~/components/LucideDynamicIcon";
import type { TaskFile } from "~/services/interfaces/tasks-service.interface";

export const getFileName = (file: TaskFile): string => {
  const extension = file.url.split(".").pop();

  return `${file.name}.${extension}`;
};

const documentExtensions: string[] = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "csv",
  "md",
  "markdown",
  "mdx",
  "mdx",
  "mdx",
  "mdx",
  "mdx",
];

const imageExtensions: string[] = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
  "ico",
  "tiff",
  "heic",
  "heif",
];

export const getFileIcon = (filename: string): IconName => {
  const fileExtension = filename.split(".").pop()?.toLowerCase();

  if (fileExtension && documentExtensions.includes(fileExtension)) {
    return "FileText";
  } else if (fileExtension && imageExtensions.includes(fileExtension)) {
    return "Image";
  } else {
    return "File";
  }
};

export const getFlAttachmentUrl = (url: string): string => {
  const newUrl = new URL(url);

  newUrl.pathname = newUrl.pathname.replace(
    /\/upload\/(?!fl_attachment)/,
    `/upload/fl_attachment/`
  );

  return newUrl.toString();
};
