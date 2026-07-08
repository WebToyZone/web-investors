import nextConfig from 'eslint-config-next';

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ['support.js'],
  },
];

export default eslintConfig;
