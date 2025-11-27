import { authenticate } from './lib/actions';

async function testAuth() {
    const formData = new FormData();
    formData.append('email', 'trainer@helpfit.com');
    formData.append('password', '123456');

    try {
        console.log('Calling authenticate...');
        const result = await authenticate(undefined, formData);
        console.log('Result:', result);
    } catch (e) {
        console.error('Error calling authenticate:', e);
    }
}

testAuth();
