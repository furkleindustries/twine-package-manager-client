/* react */
jest.mock('react-router');
import { browserHistory, } from 'react-router';

/* redux */
jest.mock('../store');
import store from '../store';

store.getState.mockImplementation(() => {
    return {
        appPanes: {
            login: {},
            profile: {},
        },

        profile: {
            rollback: {},
            packages: [],
            testing: 'test',
        },
    };
});

jest.mock('../appActions');
import {
    setAppPanes,
    setAppSelectedPane,
    setCSRFToken,
} from '../appActions';

jest.mock('../panes/login/loginActions');
import {
    setUsername,
    setPassword,
} from '../panes/login/loginActions';

jest.mock('../panes/profile/profileActions');
import {
    setProfile,
    setProfileRollback,
} from '../panes/profile/profileActions';

const actionMocks = {
    setAppPanes,
    setAppSelectedPane,
    setCSRFToken,
    setUsername,
    setPassword,
    setProfile,
    setProfileRollback,
};

Object.keys(actionMocks).forEach(key => {
    actionMocks[key].mockImplementation(value => {
        return { type: key, };
    });
});

/* modules */
import loginRender from './loginRender';
import deepCopy from './deepCopy';

jest.mock('./database/get');
import * as get from './database/get';

describe('loginRender unit tests', () => {
    beforeEach(() => {
        window.localStorage = {};
        browserHistory.push.mockClear();
        store.dispatch.mockClear();
        setAppPanes.mockClear();
        setAppSelectedPane.mockClear();
        setCSRFToken.mockClear();
        setUsername.mockClear();
        setPassword.mockClear();
        setProfile.mockClear();
        setProfileRollback.mockClear();
        get.userdata.mockClear();
    });

    it('passes argument to get.userdata', async () => {
        get.userdata.mockImplementationOnce(() => {
            return {
                status: 200,
            };
        });

        await loginRender('test_token');

        expect(get.userdata.mock.calls.length).toBe(1);
        expect(get.userdata.mock.calls[0]).toEqual(['test_token']);
    });

    it('calls action creators correctly when get.userdata succeeds', async () => {
        get.userdata.mockImplementationOnce(() => {
            return {
                status: 200,
                userdata: {
                    test: 'testing',
                },
            };
        });

        await loginRender('test_token');

        expect(setAppPanes.mock.calls.length).toBe(1);
        expect(setAppPanes.mock.calls[0]).toEqual([
            {
                login: { visible: false, },
                profile: { visible: true, },
            },
        ]);

        expect(setProfile.mock.calls.length).toBe(1);
        expect(setProfile.mock.calls[0]).toEqual([
            { test: 'testing', },
        ]);

        expect(setProfileRollback.mock.calls.length).toBe(1);
        expect(setProfileRollback.mock.calls[0]).toEqual([
            { testing: 'test', },
        ]);
    });

    it('calls store.dispatch correctly when get.userdata succeeds', async () => {
        get.userdata.mockImplementationOnce(() => {
            return {
                status: 200,
                userdata: { test: 'testing', },
            };
        });

        await loginRender('test_token');

        expect(store.dispatch.mock.calls.length).toBe(5);
        expect(store.dispatch.mock.calls[0]).toEqual([
            {   
                type: 'setAppPanes',
            },
        ]);

        expect(store.dispatch.mock.calls[1]).toEqual([
            {
                type: 'setProfile',
            },
        ]);

        expect(store.dispatch.mock.calls[2]).toEqual([
            {
                type: 'setProfileRollback',
            },
        ]);

        expect(store.dispatch.mock.calls[3]).toEqual([
            {
                type: 'setUsername',
            },
        ]);

        expect(store.dispatch.mock.calls[4]).toEqual([
            {
                type: 'setPassword',
            },
        ]);
    });

    it('redirects to the profile page when get.userdata succeeds and gotoProfile is true or gotoProfile is "gotoProfile"', async () => {
        get.userdata.mockImplementationOnce(() => {
            return {
                status: 200,
                userdata: {},
            };
        });

        await loginRender('test_token', 'gotoProfile');

        expect(store.dispatch.mock.calls.length).toBe(6);
        expect(store.dispatch.mock.calls[5]).toEqual([
            { type: 'setAppSelectedPane', },
        ]);

        expect(browserHistory.push.mock.calls.length).toBe(1);
        expect(/\/profile$/.test(browserHistory.push.mock.calls[0]))
            .toBe(true);
    });

    it('creates side effects correctly when get.userdata fails with errorCode of no_access_cookie', async () => {
        get.userdata.mockImplementationOnce(() => {
            return {
                status: 400,
                errorCode: 'no_access_cookie',
            };
        });

        localStorage = {
            twinepmCSRFToken: 'should be deleted',
        };

        setCSRFToken.mockImplementationOnce(value => {
            return {
                csrfToken: value,
                type: 'setCSRFToken',
            };
        });

        await loginRender('test_token');

        expect('twinepmCSRFToken' in localStorage).toBe(false);
        
        expect(setCSRFToken.mock.calls.length).toBe(1);
        expect(setCSRFToken.mock.calls[0]).toEqual([null]);

        expect(store.dispatch.mock.calls.length).toBe(1);
        expect(store.dispatch.mock.calls[0]).toEqual([
            {
                csrfToken: null,
                type: 'setCSRFToken',
            },
        ]);
    });

    it('creates side effects correctly when get.userdata fails with errorCode of anti_csrf_mismatch', async () => {
        get.userdata.mockImplementationOnce(() => {
            return {
                status: 400,
                errorCode: 'anti_csrf_mismatch',
            };
        });

        localStorage = {
            twinepmCSRFToken: 'should be deleted',
        };

        setCSRFToken.mockImplementationOnce(value => {
            return {
                csrfToken: value,
                type: 'setCSRFToken',
            };
        });

        await loginRender('test_token');

        expect('twinepmCSRFToken' in localStorage).toBe(false);
        
        expect(setCSRFToken.mock.calls.length).toBe(1);
        expect(setCSRFToken.mock.calls[0]).toEqual([null]);

        expect(store.dispatch.mock.calls.length).toBe(1);
        expect(store.dispatch.mock.calls[0]).toEqual([
            {
                csrfToken: null,
                type: 'setCSRFToken',
            },
        ]);
    });

    it('creates side effects correctly when get.userdata fails with errorCode of no_access_cookie and appSelectedPane is profile', async () => {
        get.userdata.mockImplementationOnce(() => {
            return {
                status: 400,
                errorCode: 'no_access_cookie',
            };
        });

        localStorage = {
            twinepmCSRFToken: 'should be deleted',
        };

        setCSRFToken.mockImplementationOnce(value => {
            return {
                csrfToken: value,
                type: 'setCSRFToken',
            };
        });

        store.getState.mockImplementationOnce(() => {
            return {
                appPanes: {
                    login: {},
                    profile: {},
                },
                
                profile: {},
            };
        });

        await loginRender('test_token');

        expect('twinepmCSRFToken' in localStorage).toBe(false);
        
        expect(setCSRFToken.mock.calls.length).toBe(1);
        expect(setCSRFToken.mock.calls[0]).toEqual([null]);

        expect(store.dispatch.mock.calls.length).toBe(1);
        expect(store.dispatch.mock.calls[0]).toEqual([
            {
                csrfToken: null,
                type: 'setCSRFToken',
            },
        ]);
    });

    it('handles side effects if get.userdata fails with an errorCode of no_access_cookie or anti_csrf_mismatch and appSelectedPane of profile', async () => {
        get.userdata.mockImplementationOnce(() => {
            return {
                status: 400,
                errorCode: 'no_access_cookie',
            };
        });

        store.getState.mockImplementationOnce(() => {
            return { appSelectedPane: 'profile', };
        });

        await loginRender('test_token');

        expect(setAppSelectedPane.mock.calls.length).toBe(1);
        expect(setAppSelectedPane.mock.calls[0]).toEqual(['login']);

        expect(store.dispatch.mock.calls.length).toBe(2);
        expect(store.dispatch.mock.calls[1]).toEqual([
            { type: 'setAppSelectedPane', },
        ]);

        expect(browserHistory.push.mock.calls.length).toBe(1);
        expect(/\/login$/.test(browserHistory.push.mock.calls[0][0]))
            .toEqual(true);
    });

    it('does not redirect when loginRender is called with appSelectedPane !== profile', async () => {
        get.userdata.mockImplementationOnce(() => {
            return {
                status: 400,
                errorCode: 'anti_csrf_mismatch',
            };
        });

        await loginRender('test_token');

        expect(store.dispatch.mock.calls.length).toBe(1);
        expect(browserHistory.push.mock.calls.length).toBe(0);
    });

    it('only logs with no other side effects when the response has an error or status !== 200 and errorCode !== no_access_cookie or anti_csrf_mismatch', async () => {
        const log = console.log;
        console.log = jest.fn();

        get.userdata.mockImplementationOnce(() => {
            return { error: 'test error', };
        });

        await loginRender('test_token');

        expect(store.dispatch.mock.calls.length).toBe(0);
        expect(console.log.mock.calls.length).toBe(1);

        console.log = log;
    });

    it('logs exceptions thrown by get.userdata', async () => {
        const log = console.log;
        console.log = jest.fn();

        const exception = new Error('uh oh!');
        get.userdata.mockImplementationOnce(() => {
            throw exception;
        });

        await loginRender('test_token');

        expect(console.log.mock.calls.length).toBe(1);
        expect(console.log.mock.calls[0]).toEqual([exception]);

        console.log = log;
    });
});