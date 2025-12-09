import axios from "axios";

export default () => {};

export const getServerSideProps = async (context) => {
  const { code, state } = context.query;

  // TODO: Actually compare state with stored state value
  if (!state) {
    return {
      redirect: {
        permanent: false,
        destination: "/#error=state_mismatch",
      },
      props: {},
    };
  }

  try {
    // Spotify API token endpoint
    const tokenEndpoint = "https://accounts.spotify.com/api/token";

    // Base64 encode client_id and client_secret
    const clientId = process.env.NEXT_PUBLIC__SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    // Make the POST request to exchange the code for a token
    const response = await axios.post(
      tokenEndpoint,
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.NEXT_PUBLIC__CALLBACK_URL,
      }).toString(),
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = response.data;

    // Redirect to the home page with the access token as a query parameter
    return {
      redirect: {
        permanent: false,
        destination: `/?token=${access_token}`,
      },
      props: {},
    };
  } catch (error) {
    console.error(
      "Error exchanging code for token:",
      error.response?.data || error.message
    );

    return {
      redirect: {
        permanent: false,
        destination: "/#error=token_exchange_failed",
      },
      props: {},
    };
  }
};
