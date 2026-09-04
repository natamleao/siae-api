import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIAE API - Documentação',
      version: '1.0.0',
      description: 'API do Sistema de Atendimento e Encaminhamento (SIAE) com suporte a autenticação OAuth2 Password Flow e Bearer JWT.',
      contact: {
        name: 'Equipe SIAE',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        OAuth2PasswordBearer: {
          type: 'oauth2',
          description: 'Autenticação OAuth2 (Password Flow). Informe seu email no campo "username" e sua senha no campo "password". O Swagger obterá o token automaticamente.',
          flows: {
            password: {
              tokenUrl: '/auth/login',
              scopes: {},
            },
          },
        }
        // BearerAuth: {
        //   type: 'http',
        //   scheme: 'bearer',
        //   bearerFormat: 'JWT',
        //   description: 'Insira o token JWT diretamente (sem precisar do prefixo Bearer).',
        // },
      },
      schemas: {
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@siae.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: '123456',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            token_type: {
              type: 'string',
              example: 'bearer',
            },
            expires_in: {
              type: 'number',
              example: 604800,
            },
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Login realizado com sucesso',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                email: { type: 'string', example: 'admin@siae.com' },
                permissao: { type: 'string', example: 'ADMIN' },
              },
            },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'aluno@siae.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: '123456',
            },
            matricula: {
              type: 'number',
              example: 2024001,
            },
            permissao: {
              type: 'string',
              enum: ['ALUNO', 'TECNICO', 'ASSISTENTE'],
              example: 'ALUNO',
            },
          },
        },
        ForgotPasswordInput: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'usuario@siae.com',
            },
          },
        },
        ResetPasswordInput: {
          type: 'object',
          required: ['token', 'newPassword'],
          properties: {
            token: {
              type: 'string',
              example: 'a4f6d3b9e1c2...',
            },
            newPassword: {
              type: 'string',
              format: 'password',
              example: 'novaSenha123',
            },
          },
        },
        FuncionarioRegisterInput: {
          type: 'object',
          required: ['nome', 'siape', 'email', 'senha', 'permissao'],
          properties: {
            nome: {
              type: 'string',
              example: 'João Silva',
            },
            siape: {
              type: 'string',
              example: '1234567',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao.silva@siae.com',
            },
            senha: {
              type: 'string',
              format: 'password',
              example: 'senhaForte123',
            },
            permissao: {
              type: 'string',
              enum: ['TECNICO', 'ASSISTENTE', 'ADMIN'],
              example: 'TECNICO',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operação realizada com sucesso' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Mensagem de erro' },
            error: { type: 'string', example: 'Detalhes adicionais' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
