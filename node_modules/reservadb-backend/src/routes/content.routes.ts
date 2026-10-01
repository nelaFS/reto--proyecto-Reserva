import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth.js'
import { ContentRepository, type ContentResource } from '../repositories/content.repository.js'
import { eventoSchema, mesaSchema, platoSchema, promocionSchema } from '../schemas/content.schema.js'

const schemas = { mesas: mesaSchema, menu: platoSchema, eventos: eventoSchema, promociones: promocionSchema }

export function createContentRoutes(resource: ContentResource, protectedRoutes: boolean) {
  const app = new Hono()
  const repository = new ContentRepository()
  const schema = schemas[resource]

  if (protectedRoutes) app.use('*', requireAuth)

  app.get('/', async (c) => c.json({ data: await repository.list(resource) }, 200))
  if (protectedRoutes) {
    app.post('/', async (c) => c.json({ data: await repository.create(resource, schema.parse(await c.req.json())) }, 201))
    app.patch('/:id', async (c) => c.json({ data: await repository.update(resource, Number(c.req.param('id')), schema.partial().parse(await c.req.json())) }, 200))
    app.delete('/:id', async (c) => {
      await repository.remove(resource, Number(c.req.param('id')))
      return c.json({ data: { deleted: true } }, 200)
    })
  }
  return app
}
