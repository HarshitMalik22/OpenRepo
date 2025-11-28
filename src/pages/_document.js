import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Remove bis_skin_checked attributes after hydration
              document.addEventListener('DOMContentLoaded', () => {
                const removeAttributes = () => {
                  document.querySelectorAll('[bis_skin_checked]').forEach(el => {
                    el.removeAttribute('bis_skin_checked');
                  });
                };
                
                // Run immediately
                removeAttributes();
                
                // Run again after a short delay to catch any dynamic content
                setTimeout(removeAttributes, 1000);
              });
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
