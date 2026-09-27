import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { categoryGroup, findProduct, getMeta, loadCatalog, queryProducts } from '../src/catalog.js';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.resolve(testDir, '../../data/catalog.csv');
const products = await loadCatalog(catalogPath);

test('loads the complete catalog with unique product IDs', () => {
  assert.equal(products.length, 4032);
  assert.equal(new Set(products.map((product) => product.id)).size, products.length);
});

test('exposes category and format filter values', () => {
  const filters = getMeta(products);
  assert.ok(filters.categories.length > 0);
  assert.ok(filters.formats.length > 0);
});

test('searches by name and applies exact category and format filters', () => {
  const product = products[0];
  const results = queryProducts(products, {
    q: product.name.toLocaleLowerCase('es'),
    category: categoryGroup(product.category),
    format: product.format,
  });

  assert.ok(results.items.some((item) => item.id === product.id));
});

test('uses eight items per page and clamps an out-of-range page', () => {
  const results = queryProducts(products, { page: Number.MAX_SAFE_INTEGER });

  assert.equal(results.pageSize, 8);
  assert.equal(results.page, results.totalPages);
  assert.equal(results.items.length, 8);
});

test('finds a product by ID and returns null for an unknown ID', () => {
  assert.equal(findProduct(products, products[0].id)?.id, products[0].id);
  assert.equal(findProduct(products, 'not-a-product'), null);
});