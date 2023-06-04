import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
   const usersTypes = [
      {
         id: 1,
         title: 'ADMIN',
      },
      {
         id: 2,
         title: 'INVESTOR',
      },
      {
         id: 3,
         title: 'CLIENT',
      },
   ];

   const defaultUsersList = [
      {
         name: 'Nikolas Stelmakh',
         email: 'nikolasstelmah@ukr.net',
         is_email_confirmed: true,
         user_type_id: 1,
         password: '123456',
      },
      {
         name: 'Yaroslav Stelmakh',
         email: 'stelmakh.yaroslav@icloud.com',
         is_email_confirmed: true,
         user_type_id: 1,
         password: '123456',
      },
   ];

   const isUserTypesCreated = await prisma.userType.findFirst({
      where: {
         id: usersTypes[0].id,
         title: usersTypes[0].title,
      },
   });

   if (isUserTypesCreated) {
      console.log('User types is already added. Scipping...');
   } else {
      await prisma.userType.createMany({
         data: usersTypes,
      });
   }

   const isAdminAlreadyCreated = await prisma.user.findFirst({
      where: {
         email: defaultUsersList[0].email,
      },
   });

   if (isAdminAlreadyCreated) {
      console.log('Default admin is already created. Scipping...');
   } else {
      // todo: rewrite with "safe" methods
      await prisma.$executeRawUnsafe(`
      INSERT INTO "User" (email, password, name, user_type_id, is_email_confirmed)
      VALUES ${defaultUsersList
      .map(
         (u) =>
            `('${u.email}', crypt('${u.password}', gen_salt('bf')), '${u.name}', ${u.user_type_id}, ${u.is_email_confirmed})`,
      )
      .join(',')} ON CONFLICT DO NOTHING;`);
   }

   return;
}
main()
   .then(async () => {
      console.log('successfully seeded');
      await prisma.$disconnect();
   })
   .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
   });
