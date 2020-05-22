module.exports = {
  type: 'mysql',
  database: '',
  username: '',
  password: '',
  host: '',
  port: -1,
  logging: 'false',
  entities: (typeof process[Symbol.for('ts-node.register.instance')] === 'object' || process.env.NODE_ENV === 'test')
    ? ['./src/server/models/*.ts']
    : ['./dist/server/models/*.js']
}
