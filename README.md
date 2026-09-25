# ayushummadi.github.io

Personal site for Ayush Ummadi, data analyst. Plain HTML, CSS and JavaScript.
No build step, no framework, nothing to install.

## What's in here

```
index.html                 every word on the site lives here
assets/styles.css          all the design
assets/script.js           name animation, nav, theme switch
assets/portrait.jpg        the About photo
assets/og-image.png        the preview card LinkedIn shows
assets/favicon.svg         browser tab icon
assets/apple-touch-icon.png
assets/Ayush_Ummadi_Data_Analyst_Resume.pdf
```

## Put it online

You only do this once. It's free and takes about five minutes.

1. Sign in to GitHub and go to https://github.com/new
2. Name the repository exactly `AyushUmmadi.github.io`. It has to match your
   username or the free URL won't work. Set it to **Public**. Don't tick
   "Add a README file". Click **Create repository**.
3. On the empty repository page, click **uploading an existing file**.
4. Drag in `index.html`, `README.md`, and the whole `assets` folder. Drag the
   folder itself, not the files inside it, so the paths stay correct.
5. Leave the commit message as-is and click **Commit changes**.
6. Go to **Settings**, then **Pages** in the left sidebar. Under "Build and
   deployment", Source should say "Deploy from a branch", Branch should be
   `main` and the folder `/ (root)`. Click **Save** if you changed anything.
7. Wait two or three minutes, then open **https://ayushummadi.github.io**

If you get a 404 on the first try, wait another minute and refresh. The first
deploy is always the slowest.

## Post it on LinkedIn

Paste the URL into a post and LinkedIn pulls in the preview card by itself:
the dotted name, your headline, and the link. Give it a second to load before
you hit Post.

If the preview looks wrong or shows an old version, run the URL through
https://www.linkedin.com/post-inspector/ and it'll refresh LinkedIn's copy.

Also worth doing: **Profile, Add profile section, Featured, Add a link**. That
puts the site near the top of your profile, where recruiters land.

## Changing things later

**Any text on the site.** Open `index.html` and edit it. Everything visible is
plain text between the tags. Nothing else needs to change.

**The resume.** Replace `assets/Ayush_Ummadi_Data_Analyst_Resume.pdf` with your
new one, keeping the exact same filename. It's a PDF because most recruiters
open it on a phone, where a Word file often can't be read. If you tailor the
resume per application, this is the general version.

**When you land a job**, delete the availability line near the top of
`index.html`:

```html
<p class="avail"><span class="dot" aria-hidden="true"></span>Available for full-time data analyst roles</p>
```

Leaving it up after you've signed somewhere is the kind of thing a new employer
notices.

**Adding a project.** Copy any block that starts with `<details class="project">`
in the "More projects" section, paste it below, and change the title, the
subject line, the description, the finding, the recommendation and the link.
Keep the pattern: what the data showed, then what you'd do about it.

**Colours and type** live at the top of `assets/styles.css` as `--bg`, `--ink`,
`--accent` and friends. Ink is the dark theme, Paper is the light one. Change a
value in one place and it updates everywhere.

## Notes

The fonts (Newsreader and IBM Plex Sans) load from Google Fonts, so the site
needs a connection to look exactly right. Everything else is self-contained.

The name animation respects reduced-motion settings, the layout is built
mobile-first, and the whole page is a few hundred kilobytes, so it opens fast
on a phone.
