import Head from 'next/head';
import packageJson from '../../package.json';

function PageContainer({ children, title = packageJson.title }) {
    return (
        <>
            <Head>
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="favicon/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="favicon/favicon-16x16.png"
                />
                <link
                    rel="mask-icon"
                    href="favicon/safari-pinned-tab.svg"
                    color="#5bbad5"
                />
                <link rel="shortcut icon" href="favicon/favicon.ico" />
                <meta name="description" content={packageJson.description} />
                <meta name="msapplication-TileColor" content="#da532c" />

                {/* <meta charset="utf-8" /> */}

                {/* All phones */}
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />

                {/* iPhones */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-title"
                    content={packageJson.title}
                />
                <link
                    rel="apple-touch-icon"
                    href="favicon/apple-touch-icon.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="152x152"
                    href="favicon/android-chrome-192x192.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="favicon/apple-touch-icon.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="167x167"
                    href="favicon/android-chrome-192x192.png"
                />

                <meta name="theme-color" content="#147CC1" />
                <meta name="description" content={packageJson.description} />

                {/* 
                    manifest.json provides metadata used when your web app is installed on a
                    user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/ 
                */}
                <link rel="manifest" href="manifest.json" />

                <title>{title}</title>
            </Head>
            <main className="bg-gray-100 text-black dark:bg-gray-900 dark:text-white min-h-screen">
                {children}
            </main>
        </>
    );
}

export default PageContainer;
