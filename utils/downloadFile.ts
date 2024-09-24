export const handleDownload = (fileName: string, urlLink: string) => {
  const link = document.createElement("a");
  link.href = urlLink;
  link.target = "_blank"; // Open in a new tab
  link.rel = "noopener noreferrer"; // Security measure for opening links in a new tab
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
