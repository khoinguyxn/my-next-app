import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        pathname: '/',
        route: '/',
        query: {},
        asPath: '/',
        push: jest.fn(),
        replace: jest.fn(),
        reload: jest.fn(),
        back: jest.fn(),
        prefetch: jest.fn(),
        beforePopState: jest.fn(),
        events: {
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn()
        },
        isFallback: false,
    }),
}));
