import { pgTable, serial, text, timestamp, decimal, integer, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  nomeCompleto: varchar('nome_completo', { length: 255 }).notNull(),
  cpf: varchar('cpf', { length: 11 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  agencia: varchar('agencia', { length: 10 }).notNull(),
  numeroConta: varchar('numero_conta', { length: 20 }).notNull(),
  saldo: decimal('saldo', { precision: 12, scale: 2 }).default('0.00'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  accountId: integer('account_id').references(() => accounts.id).notNull(),
  tipo: varchar('tipo', { length: 50 }).notNull(), // EX: 'PIX_IN', 'PIX_OUT', 'TED'
  valor: decimal('valor', { precision: 12, scale: 2 }).notNull(),
  descricao: text('descricao'),
  dataTransacao: timestamp('data_transacao').defaultNow(),
});

// Relacionamentos para queries otimizadas
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
  transactions: many(transactions),
}));