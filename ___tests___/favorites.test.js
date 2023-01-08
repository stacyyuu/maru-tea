const { server } = require('../src/server.js');
const supertest = require('supertest');
const { sequelize } = require('../src/models');
const { User } = require('../src/auth/models');
const request = supertest(server);
const { signIn } = require('../src/auth/routes/index');
const b64 = require('js-base64');


beforeEach(async () => {await sequelize.sync()});


const createUser = async () => {
  return await request.post('/signup').send({
    username: 'testuser',
    password: 'testpass',
    role: 'user'
  });


};

const signUserIn = async () => {
  await sequelize.sync();
    await User.createWithHashed('Maru', 'pip1', 'user');

    // act
    const req = {
      header: jest.fn().mockImplementation((header) => {
        if (header === 'Authorization') {
          return 'Basic ' + b64.encode('Maru:pip1:user');
        }
        return '';
      }),
    };
    const res = { send: jest.fn() };
    const next = jest.fn();
    await signIn(req, res, next);

    // assert
    
    const token = res.send.mock.lastCall[0];
    return token.toString()
}

const signUserInTwo = async () => {
    await sequelize.sync();
      await User.createWithHashed('Maru2', 'pip1', 'admin');
  
      // act
      const req = {
        header: jest.fn().mockImplementation((header) => {
          if (header === 'Authorization') {
            return 'Basic ' + b64.encode('Maru2:pip1:admin');
          }
          return '';
        }),
      };
      const res = { send: jest.fn() };
      const next = jest.fn();
      await signIn(req, res, next);
  
      // assert
      
      const token = res.send.mock.lastCall[0];
      return token.toString()
  }

const createItems = async (jwt) => {
  await request.post('/menu').set('Authorization', `Bearer ${jwt}`).send({   
    name: "Matcha Milk Tea",
    flavor: "Matcha",
    toppings: "Boba",
    sweetness: 100,
  });
  await request.post('/menu').set('Authorization', `Bearer ${jwt}`).send({
    name: "Taro Milk Tea",
    flavor: "Taro",
    toppings: "Oreo",
    sweetness: 75,
  });
}
const addFavorites = async () => {
    await createUser()
    const token = await signUserIn()
    const token2 = await signUserInTwo()
    await createItems(token2)
    
    let res = await request.post('/favorites/1').set('Authorization', `Bearer ${token}`)
    return res
}
const addFavoritesTwo = async () => {
    await createUser()
    const token = await signUserIn()
    const token2 = await signUserInTwo()
    await createItems(token2)
    
    let res = await request.post('/favorites/2').set('Authorization', `Bearer ${token}`)
    return res
}
describe('RESTful API', () => {
  
  test('Create an item', async () => {
    await createUser()
    const token = await signUserIn()
    await createItems(token)
    let res = await addFavorites()
    
    expect(res.body.name).toEqual('Matcha Milk Tea');
    expect(res.body.flavor).toEqual('Matcha');
    expect(res.body.toppings).toEqual('Boba');
    expect(res.body.sweetness).toEqual(100);
  });

  test('Find all items', async () => {
    
    
    await createUser()
    const token = await signUserIn()
    await createItems(token)
    await addFavorites()
    await addFavoritesTwo()
    let res = await request.get('/favorites').set('Authorization', `Bearer ${token}`);
    

    expect(res.body[0].name).toEqual('Matcha Milk Tea');
    expect(res.body[0].flavor).toEqual('Matcha');
    expect(res.body[1].name).toEqual('Taro Milk Tea');
    expect(res.body[1].flavor).toEqual('Taro');
    
  });

  test('Find one item', async () => {
    await createUser()
    const token = await signUserIn()
    await createItems(token)
    await addFavorites()
    await addFavoritesTwo()
    let res = await request.get('/favorites/2').set('Authorization', `Bearer ${token}`);
    
    expect(res.body.name).toEqual('Taro Milk Tea');
    expect(res.body.flavor).toEqual('Taro');
  });

  test('Updates a single favorites item', async () => {
    await createUser()
    const token = await signUserIn()
    await createItems(token)
    await addFavorites()
    await addFavoritesTwo()
    await request.put('/favorites/1').set('Authorization', `Bearer ${token}`).send({
        toppings: "Brown Sugar Boba",
        sweetness: 50,
    });
    let res = await request.get('/favorites/1').set('Authorization', `Bearer ${token}`);
    expect(res.body.toppings).toEqual('Brown Sugar Boba');
    expect(res.body.sweetness).toEqual(50);
  });

  test('Deletes a single favorites item', async () => {
    await createUser()
    const token = await signUserIn()
    await createItems(token)
    await addFavorites()
    await addFavoritesTwo()
    await request.delete('/favorites/1').set('Authorization', `Bearer ${token}`);
    let res = await request.get('/favorites').set('Authorization', `Bearer ${token}`);
    expect(res.body[0].name).toEqual('Taro Milk Tea');
    expect(res.body[0].flavor).toEqual('Taro');
  });
});

afterEach(async () => {await sequelize.drop();});