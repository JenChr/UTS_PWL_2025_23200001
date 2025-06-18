import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.preorder.findMany({
      include: { Pkg: true, customer: true },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(data); 
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch preorders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { order_date, order_by, selected_package, qty, is_paid } = await request.json();

    if (!order_date || !order_by || !selected_package || !qty || !is_paid) {
      return NextResponse.json({ error: 'All Fields Are Required' }, { status: 400 });
    }

    const preorder = await prisma.preorder.create({
      data: {
        order_date: new Date(order_date),
        order_by: Number(order_by),
        selected_package: Number(selected_package),
        qty: Number(qty),
        is_paid: is_paid === 'Lunas',
      },
    });

    return NextResponse.json(preorder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create preorder' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, order_date, order_by, selected_package, qty, is_paid } = await request.json();

    if (!id || !order_date || !order_by || !selected_package || !qty || !is_paid) {
      return NextResponse.json({ error: 'Field is Empty' }, { status: 400 });
    }

    const preorder = await prisma.preorder.update({
      where: { id },
      data: {
        order_date: new Date(order_date),
        order_by: Number(order_by),
        selected_package: Number(selected_package),
        qty: Number(qty),
        is_paid: is_paid === 'Lunas',
      },
    });

    return NextResponse.json(preorder);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update preorder' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID Not Found' }, { status: 400 });
    }

    await prisma.preorder.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted Successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete preorder' }, { status: 500 });
  }
}
