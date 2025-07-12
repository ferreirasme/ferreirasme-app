import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Testar diferentes combinações de salt
    const salts = [
      'ferreirasme-2025',
      'ferreirasme-2025-temporary',
      '',
      'New***159753ferreirasme-2025'
    ];
    
    const hashes = salts.map(salt => {
      const hash = crypto
        .createHash('sha256')
        .update((password || '') + salt)
        .digest('hex');
      
      return {
        salt,
        hash,
        input: (password || '') + salt
      };
    });
    
    // Hash que está no banco (do script SQL)
    const expectedHash = '767d99e2681abd036d1f566b7a746e04f37d51a90f93aa23f3fbe81ffd1b9114';
    
    // Verificar qual combinação gera o hash esperado
    const correct = hashes.find(h => h.hash === expectedHash);
    
    return NextResponse.json({
      password,
      expectedHash,
      testedCombinations: hashes,
      correctCombination: correct || 'Nenhuma combinação gerou o hash esperado',
      recommendation: correct 
        ? `Use o salt: "${correct.salt}"`
        : 'O hash no banco pode estar incorreto. Precisamos recalcular.'
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}