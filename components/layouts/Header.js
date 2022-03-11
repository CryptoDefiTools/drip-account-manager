import NextLink from 'next/link';
import { DarkModeSwitch } from '../DarkModeSwitch';

export default function Header({ title, children }) {
    return (
        <>
            <header className="z-50 py-10 bg-drip-blue-400 text-white dark:bg-sky-900 dark:text-white w-full">
                <div className="container px-0 xl:px-28">
                    <div className="flex flex-nowrap items-center justify-between">
                        <NextLink href="/" passHref>
                            <span className="font-semibold cursor-pointer text-4xl tracking-widest uppercase" title="Home">{title}</span>
                        </NextLink>
                        <DarkModeSwitch />
                    </div>
                    <div className="flex mt-5 space-x-5 justify-between">
                        {children}
                    </div>
                </div>
            </header>


        </>
    );
}
