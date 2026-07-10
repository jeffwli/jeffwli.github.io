# Wenjie (Jeff) Li — research homepage starter

A lightweight static academic homepage designed for GitHub Pages.

## What is already implemented

- A full-screen introduction section using the supplied background and portrait.
- A research statement section before publications.
- Large, aligned publication cards with a fixed 16:10 media frame.
- Per-publication `highlighted: true/false` control.
- Image, MP4 video, and placeholder media support.
- Responsive desktop/mobile layouts.
- No build system required.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Edit publications

Open `data/publications.js`. Each entry supports:

```js
{
  highlighted: true,
  year: "2026",
  venue: "RSS 2026",
  title: "Paper title",
  authors: ["Author One", "Wenjie Li"],
  self: "Wenjie Li",
  summary: "One-sentence plain-language contribution.",
  media: {
    type: "image", // image | video | placeholder
    src: "assets/images/paper-cover.jpg",
    poster: "assets/images/paper-poster.jpg", // optional for video
    alt: "Description of the visual"
  },
  links: [
    { label: "Paper", url: "https://..." },
    { label: "Project", url: "https://..." }
  ]
}
```

For best alignment, crop publication visuals to 16:10 before uploading. Other ratios are still accepted and center-cropped by CSS.

## Items that still need real information

Search for `YOUR_`, `href="#"`, `pending`, and `to be added`.

Most important:

- Berkeley email
- GitHub and LinkedIn URLs
- lab and advisor links
- exact publication titles/authors/venues
- publication cover images or MP4 videos

## Publish on GitHub Pages

1. Create a repository named `<github-username>.github.io`.
2. Put these files at the repository root.
3. Push to `main`.
4. In **Settings → Pages**, select **Deploy from a branch**, branch `main`, folder `/ (root)`.
