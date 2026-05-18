import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    alias: {
      '$components': 'src/components',
      '$stores': 'src/stores',
      '$data': 'src/data'
    }
  }
};

export default config;
