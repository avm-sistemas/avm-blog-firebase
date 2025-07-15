// Este script deve ser executado APENAS LOCALMENTE, no seu computador de desenvolvimento.
// NUNCA o suba para um ambiente público ou o exponha.

const admin = require('firebase-admin');

// 1. Substitua pelo caminho do seu arquivo de credenciais de serviço.
// Baixe-o em Firebase Console > Configurações do Projeto > Contas de Serviço > Gerar nova chave privada.
const serviceAccount = require('./adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 2. Substitua pelo UID do usuário que você deseja tornar o primeiro administrador.
// Você encontra seu UID na aba "Authentication" do console do Firebase.
const targetUid = 'nY44GW4qbEQiiXCga1ogINvn2Eg2';

async function setFirstAdmin() {
    try {
        // Obter os claims atuais para não sobrescrever outros (se houver)
        const userRecord = await admin.auth().getUser(targetUid);
        const currentClaims = userRecord.customClaims || {};

        console.log("currentClaims => ", currentClaims);

        // Adicionar o claim 'admin: true'
        //const newClaims = { ...currentClaims, admin: true };
        const newClaims = { ...currentClaims, roles: ['admin']  };        
        await admin.auth().setCustomUserClaims(targetUid, newClaims);                

        // Opcional: invalidar o token de refresh para forçar o usuário a obter um novo token imediatamente
        await admin.auth().revokeRefreshTokens(targetUid);

        console.log(`Usuário ${targetUid} agora é administrador com sucesso.`);
    } catch (error) {
        console.error('Erro ao definir o primeiro administrador:', error);
    }
}

setFirstAdmin();