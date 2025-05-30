import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const pkgs = await prisma.pkg.findMany({
      orderBy: { id: 'asc' },
    });
    return Response.json(pkgs, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Gagal mengambil data paket' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { kode, nama, deskripsi } = await request.json();

    if (!kode || !nama || !deskripsi) {
      return Response.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    const newPkg = await prisma.pkg.create({
      data: { kode, nama, deskripsi },
    });

    return Response.json(newPkg, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Gagal menambahkan paket' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, kode, nama, deskripsi } = await request.json();

    if (!id || !kode || !nama || !deskripsi) {
      return Response.json({ error: 'Field tidak boleh kosong' }, { status: 400 });
    }

    const updatedPkg = await prisma.pkg.update({
      where: { id },
      data: { kode, nama, deskripsi },
    });

    return Response.json(updatedPkg);
  } catch (error) {
    return Response.json({ error: 'Gagal mengupdate paket' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return Response.json({ error: 'ID tidak ditemukan' }, { status: 400 });
    }

    await prisma.pkg.delete({
      where: { id },
    });

    return Response.json({ message: 'Berhasil menghapus paket' });
  } catch (error) {
    return Response.json({ error: 'Gagal menghapus paket' }, { status: 500 });
  }
}
