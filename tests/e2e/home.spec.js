const { test, expect } = require('@playwright/test')

async function gotoRoute(page, route = '') {
  await page.goto(route ? `/#${route}` : '/')
}

async function openProjectsFromHome(page) {
  await gotoRoute(page)
  await expect(page.locator('#spaceship-loader')).toBeHidden({ timeout: 7000 })
  await page.getByRole('button', { name: 'View My Work' }).click()
  await expect(page).toHaveURL(/#\/projects$/)
  await expect(page.getByRole('heading', { name: 'My Projects' })).toBeVisible()
}

test('home page renders and navigates to projects', async ({ page }) => {
  await gotoRoute(page)
  await expect(page.locator('h1')).toContainText('Kristian Cross')
  await openProjectsFromHome(page)
})

test('projects page opens a project detail page', async ({ page }) => {
  await openProjectsFromHome(page)
  await page.locator('.project-card-link').first().click()

  await expect(page).toHaveURL(/#\/projects\/1$/)
  await expect(page.getByRole('heading', { name: 'Interactive 3D Portfolio' })).toBeVisible()
})

test('project routes work as direct deep links', async ({ page }) => {
  await gotoRoute(page, '/projects/2')

  await expect(page.locator('#spaceship-loader')).toBeHidden({ timeout: 7000 })
  await expect(page.getByRole('heading', { name: 'Vue.js Dashboard' })).toBeVisible()
})

test('projects filter narrows visible cards', async ({ page }) => {
  await gotoRoute(page, '/projects')

  await expect(page.locator('#spaceship-loader')).toBeHidden({ timeout: 7000 })
  await page.getByRole('button', { name: 'Vue.js' }).click()

  await expect(page.locator('.project-card-link')).toHaveCount(2)
  await expect(page.getByText('Vue Component Library')).toBeVisible()
})

test('contact navigation returns to the home contact section', async ({ page }) => {
  await gotoRoute(page, '/projects')

  await expect(page.locator('#spaceship-loader')).toBeHidden({ timeout: 7000 })
  await page.getByRole('button', { name: 'Contact' }).click()

  await expect(page).toHaveURL(/#\/$/)
  await expect(page.locator('#contact')).toBeInViewport()
})

test('invalid project ids show a fallback state', async ({ page }) => {
  await gotoRoute(page, '/projects/999')

  await expect(page.locator('#spaceship-loader')).toBeHidden({ timeout: 7000 })
  await expect(page.getByRole('heading', { name: 'Project Not Found' })).toBeVisible()
})