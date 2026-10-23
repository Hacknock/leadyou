import React from "react";

// Catalog READMEs are external HTML: deny scripts, same-origin access and navigation.
export default function ReadmeFrame({ title, html }: { title: string; html: string }) {
  return <iframe title={title} srcDoc={html} sandbox="" referrerPolicy="no-referrer" />;
}
