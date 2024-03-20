/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/api/:path*'
            : 'https://python-flask-leankit-api.vercel.app/api/',
      },
    ]
  },
}

module.exports = nextConfig
