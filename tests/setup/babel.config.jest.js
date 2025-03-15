module.exports = function(api) {
  // Only use this babel config for Jest
  const isTest = api.env('test');
  
  // Return different configs for different environments
  if (isTest) {
    return {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    };
  }
  
  // Return empty config for non-test environments to let Next.js use SWC
  return {};
};
