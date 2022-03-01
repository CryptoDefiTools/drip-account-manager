import NextLink from 'next/link';
import { DarkModeSwitch } from '../DarkModeSwitch';

export default function Header({ title, children }) {
    return (
        <>
            <header className="z-50 py-4 bg-white text-black dark:bg-blue-900 dark:text-white shadow-sm fixed w-full">
                <div className="container px-0 xl:px-28">
                    <div className="flex flex-nowrap px-4 md:px-5 items-center justify-between">
                        <NextLink href="/" passHref>
                            <span className="font-semibold cursor-pointer" title="Home">{title}</span>
                        </NextLink>
                        <div className="flex space-x-5 text-sm items-center">
                            {children}
                            {/* <NextLink href="/" passHref>
                                Home
                            </NextLink>

                            <NextLink href="/about" passHref>
                                About
                            </NextLink> */}
                            <DarkModeSwitch />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
