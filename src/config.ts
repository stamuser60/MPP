function getEnv(name: string, defaultValue?: string): string {
  const errMsg = `Please define ${name}`;
  const env = process.env[name];
  if (!env) {
    if (defaultValue) {
      return defaultValue;
    }
    throw Error(errMsg);
  }
  return env;
}

export const CPR_LOG_LEVEL = getEnv('CPR_LOG_LEVEL', 'info');
export const CPR_KAFKA_CONN = getEnv('CPR_KAFKA_CONN');
export const CPR_KAFKA_TOPIC = getEnv('CPR_KAFKA_TOPIC');
export const UNITY_KAFKA_CONN = getEnv('UNITY_KAFKA_CONN');
export const UNITY_KAFKA_TOPIC = getEnv('UNITY_KAFKA_TOPIC');
export const UNITY_KAFKA_GROUP_ID = getEnv('UNITY_KAFKA_GROUP_ID');
export const UNITY_KAFKA_RETRY_DISPATCH_WAIT_INTERVAL_MS = parseInt(
  getEnv('UNITY_KAFKA_RETRY_DISPATCH_WAIT_INTERVAL_MS', '0')
);
