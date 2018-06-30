import WebpackDashboard from './components/WebpackDashboard.vue';
import WebpackAnalyzer from './components/WebpackAnalyzer.vue';

ClientAddonApi.component(
  'org.vueneue.webpack.components.dashboard',
  WebpackDashboard,
);

ClientAddonApi.component(
  'org.vueneue.webpack.components.analyzer',
  WebpackAnalyzer,
);
