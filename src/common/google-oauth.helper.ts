
import axios from 'axios';

export class GoogleOAuthHelper {
  static async refreshGoogleToken(refreshToken: string): Promise<any> {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      });

      return response.data; // Contains access_token and possibly a new refresh_token
    } catch (error) {
      console.error('Error refreshing Google token:', error);
      throw new Error('Failed to refresh Google access token');
    }
  }
}
