import prisma from '@/lib/prisma';

export async function GET() {
  const data = await prisma.customer.findMany({
    orderBy: { id: 'asc' },
  });
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request) {
  const { name, phone, email } = await request.json();

  if (!name || !phone) {
    return new Response(JSON.stringify({ error: 'Name and Phone are required' }), {
      status: 400,
    });
  }

  const customer = await prisma.customer.create({
    data: {
      name,
      phone,
      email: email || null,
    },
  });

  return new Response(JSON.stringify(customer), { status: 201 });
}

export async function PUT(request) {
  const { id, name, phone, email } = await request.json();

  if (!id || !name || !phone) {
    return new Response(JSON.stringify({ error: 'ID, Name, and Phone are required' }), {
      status: 400,
    });
  }

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      name,
      phone,
      email: email || null,
    },
  });

  return new Response(JSON.stringify(customer), { status: 200 });
}

export async function DELETE(request) {
  const { id } = await request.json();

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID Not Found' }), { status: 400 });
  }

  await prisma.customer.delete({
    where: { id },
  });

  return new Response(JSON.stringify({ message: 'Deleted Successfully' }), { status: 200 });
}
 