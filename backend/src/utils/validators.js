import { body, param, query } from 'express-validator';

export const senhaForte = (valor) => {
  // mínimo 8, inclui número e caractere especial
  const forte = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return forte.test(valor);
};

export const registerValidator = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('senha')
    .custom(senhaForte)
    .withMessage('Senha fraca: mínimo 8, com número e caractere especial')
];

export const loginValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').notEmpty().withMessage('Senha é obrigatória')
];

export const updateUserValidator = [
  body('nome').optional().trim().notEmpty().withMessage('Nome não pode ser vazio'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('dataNascimento').optional().isISO8601().toDate().withMessage('Data inválida')
];

export const changePasswordValidator = [
  body('senhaAtual').notEmpty().withMessage('Senha atual é obrigatória'),
  body('novaSenha')
    .custom(senhaForte)
    .withMessage('Nova senha fraca: mínimo 8, com número e caractere especial')
];

export const searchValidator = [
  query('q').trim().notEmpty().withMessage('Informe um termo de busca')
];

export const addWatchlistValidator = [
  body('tmdbId').isInt().withMessage('tmdbId inválido'),
  body('titulo').trim().notEmpty().withMessage('Título obrigatório'),
  body('posterPath').optional().isString(),
  body('overview').optional().isString(),
  body('releaseDate').optional().isString()
];

export const movieIdParamValidator = [
  param('tmdbId').isInt().withMessage('tmdbId inválido')
];
