import 'dotenv/config';

const REQUIRED_VARS = ['PORT', 'NODE_ENV', 'MONGO_URI'];

function validateEnv() {
  const missing = [];
  for (const variable of REQUIRED_VARS) {
    if (!process.env[variable]) missing.push(variable);
  }
  if (missing.length > 0) {
    console.error('❌ ERROR: Faltan las siguientes variables de entorno:');
    missing.forEach((v) => console.error(`   → ${v}`));
    console.error('📄 Revisá el archivo .env.example para configurarlas.');
    process.exit(1);
  }
  console.log('✅ Variables de entorno validadas correctamente.');
}

validateEnv();

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const MONGO_URI = process.env.MONGO_URI;
