export default function Head() {
  return (
    <>
      <title>Leberkas Vote</title>
      <meta charSet="utf-8" />
      <meta content="width=device-width" name="viewport" />
      <meta
        content="Stimme für die beliebteste Speise Österreichs ab."
        name="description"
      />

      <meta content="Leberkas Vote" property="og:title" />
      <meta content="website" property="og:type" />
      <meta content="https://vote.schaffernak.digital" property="og:url" />
      <meta
        content="https://vote.schaffernak.digital/og.jpg"
        property="og:image"
      />
      <meta content="Leberkas Vote" name="twitter:title" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="https://vote.schaffernak.digital" property="twitter:url" />
      <meta
        content="https://vote.schaffernak.digital/og.jpg"
        name="twitter:image"
      />

      <link
        href="/apple-touch-icon.png"
        rel="apple-touch-icon"
        sizes="180x180"
      />
      <link
        href="/favicon-32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href="/favicon-16x16.png"
        rel="icon"
        sizes="16x16"
        type="image/png"
      />
      <link href="/site.webmanifest" rel="manifest" />
      <link color="#176E32" href="/safari-pinned-tab.svg" rel="mask-icon" />
      <meta content="#176E32" name="msapplication-TileColor" />
      <meta content="#ffffff" name="theme-color"></meta>

      <script async src="https://cdn.splitbee.io/sb.js"></script>
    </>
  );
}
