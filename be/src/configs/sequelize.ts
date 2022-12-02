import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('postgres://popoback:popoback@localhost:5432/popoback');
