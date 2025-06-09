import { Button, Container, Content, Header, Modal, Pagination, Table, Notification, Form } from "rsuite";
import PlusIcon from '@rsuite/icons/Plus';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import VisibleIcon from '@rsuite/icons/Visible';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';

export default function Home() {

  const { Column, HeaderCell, Cell } = Table;

  const [destinationData, setDestinationData] = useState([]);
  const emptyForm = {
    name: '',
    category: '',
    description: '',
    indoorOutdoor: '',
    location: '',
    operatingHours: '',
    price: 0,
    ratings: 0,
    imgurl: '',
    websiteurl: ''
  };
  const [destinationForm, setDestinationForm] = useState(emptyForm);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Handle Pagination
  const handleChangeLimit = dataKey => {
    setPage(1);
    setLimit(dataKey);
  };

  const paginatedData = destinationData.filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });

  // Get Destination API
  const getDestinationData = async () => {
    const querySnapshot = await getDocs(collection(db, "destinasi"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setDestinationData(data);
  };

  // Delete Destination API
  const deleteDestination = async (id) => {
    try {
      await deleteDoc(doc(db, "destinasi", id));
      getDestinationData();
      Notification.success({
        title: 'Success',
        description: 'Destination deleted successfully',
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Add Destination API
  const addDestination = async () => {
    try {
      await addDoc(collection(db, "destinasi"), destinationForm);
      getDestinationData();
      setDestinationForm(emptyForm);
      setShowAddModal(false);
    } catch (error) {
      console.log(error);
    }
  }

  // Edit Destination API
  const editDestination = async () => {
    try {
      const destinationRef = doc(db, "destinasi", destinationForm.id);

      const updatedData = {
        name: destinationForm.name,
        category: destinationForm.category,
        description: destinationForm.description,
        indoorOutdoor: destinationForm.indoorOutdoor,
        location: destinationForm.location,
        operatingHours: destinationForm.operatingHours,
        price: destinationForm.price,
        ratings: destinationForm.ratings,
        imgurl: destinationForm.imgurl,
        websiteurl: destinationForm.websiteurl
      }

      await updateDoc(destinationRef, updatedData);
      getDestinationData();
      setDestinationForm(emptyForm);
      setShowEditModal(false);
    } catch (error) {
      console.log(error);
    }
  }

  // Trigger fetch data on render
  useEffect(() => {
    getDestinationData();
  }, [])

  return (
    <div className="m-10">
      <Container>
        <Header className="mb-14">
          <h1 className="font-semibold text-4xl">Admin Dashboard</h1>
        </Header>
        <Content className="w-full mx-auto">
          <div className="flex justify-end">
            <Button style={{ backgroundColor: "#FAEB68" }} size="lg" startIcon={<PlusIcon />} onClick={() => setShowAddModal(true)}>
              Add Destination
            </Button>
          </div>
          <div className="mt-8">
            <Table height={420} bordered cellBordered data={paginatedData}>
              <Column width={75} align="center" fixed="left">
                <HeaderCell>No</HeaderCell>
                <Cell>
                  {(rowData, rowIndex) => (page - 1) * limit + rowIndex + 1}
                </Cell>
              </Column>
              <Column width={250} resizable>
                <HeaderCell align="center">Nama</HeaderCell>
                <Cell dataKey="name" />
              </Column>
              <Column width={200} resizable>
                <HeaderCell align="center">Kategori</HeaderCell>
                <Cell dataKey="category" />
              </Column>
              <Column width={400} resizable>
                <HeaderCell align="center">Deskripsi</HeaderCell>
                <Cell dataKey="description" />
              </Column>
              <Column width={200} resizable>
                <HeaderCell align="center">Area</HeaderCell>
                <Cell dataKey="indoorOutdoor" />
              </Column>
              <Column width={200} resizable>
                <HeaderCell align="center">Lokasi</HeaderCell>
                <Cell dataKey="location" />
              </Column>
              <Column width={200} resizable align="center">
                <HeaderCell>Jam Operasi</HeaderCell>
                <Cell dataKey="operatingHours" />
              </Column>
              <Column width={200} resizable align="center">
                <HeaderCell>Harga</HeaderCell>
                <Cell dataKey="price">
                  {rowData => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(rowData.price)}
                </Cell>
              </Column>
              <Column width={200} resizable align="center">
                <HeaderCell>Penilaian</HeaderCell>
                <Cell dataKey="ratings" />
              </Column>
              <Column width={200} resizable>
                <HeaderCell align="center">URL Gambar</HeaderCell>
                <Cell dataKey="imgurl" />
              </Column>
              <Column width={200} resizable>
                <HeaderCell align="center">URL Website</HeaderCell>
                <Cell dataKey="websiteurl" />
              </Column>
              <Column width={200} fixed="right" align="center">
                <HeaderCell>Action</HeaderCell>
                <Cell>
                  {rowData => (
                    <div className="flex gap-2 justify-center items-center h-full">
                      <Button
                        style={{ backgroundColor: "#FAEB68" }}
                        onClick={() => {
                          setShowDetailModal(true);
                          setSelectedDestination(rowData);
                        }}
                      >
                        <VisibleIcon />
                      </Button>
                      <Button
                        style={{ backgroundColor: "#FAEB68" }}
                        onClick={() => {
                          setShowEditModal(true);
                          setDestinationForm(rowData);
                        }}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        style={{ backgroundColor: "#FAEB68", color: "red" }}
                        onClick={() => {
                          deleteDestination(rowData.id);
                        }}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  )}
                </Cell>
              </Column>
            </Table>
            <div style={{ padding: 20 }}>
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={5}
                size="xs"
                layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                total={destinationData.length}
                limitOptions={[10, 30, 50]}
                limit={limit}
                activePage={page}
                onChangePage={setPage}
                onChangeLimit={handleChangeLimit}
              />
            </div>
          </div>
        </Content>

        {/* View Detail Modal */}
        <Modal
          backdrop="static"
          open={showDetailModal}
          onClose={() => { setShowDetailModal(false); setSelectedDestination(null) }}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Detail Destinasi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-3">
              {[
                ["Nama", selectedDestination?.name],
                ["Kategori", selectedDestination?.category],
                ["Deskripsi", selectedDestination?.description],
                ["Area", selectedDestination?.indoorOutdoor],
                ["Lokasi", selectedDestination?.location],
                ["Jam Operasi", selectedDestination?.operatingHours],
                [
                  "Harga",
                  new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(selectedDestination?.price || 0),
                ],
                ["Penilaian", selectedDestination?.ratings],
                ["URL Gambar", selectedDestination?.imgurl],
                ["URL Website", selectedDestination?.websiteurl],
              ].map(([label, value]) => (
                <div key={label} className="flex">
                  <div className="w-30 font-semibold">{label}</div>
                  <div className="w-2">:</div>
                  <div className="ml-4 flex-1">{value}</div>
                </div>
              ))}
            </div>
          </Modal.Body>
        </Modal>

        {/* Add Destination Modal */}
        <Modal
          backdrop="static"
          open={showAddModal}
          onClose={() => { setShowAddModal(false); setDestinationForm(emptyForm) }}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Destinasi Baru</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              fluid
              formValue={destinationForm}
              onChange={setDestinationForm}
            >
              <div className="flex flex-col gap-3">
                <Form.Group>
                  <Form.ControlLabel>Nama</Form.ControlLabel>
                  <Form.Control
                    name="name"
                    value={destinationForm.name}
                    placeholder="Masukkan Nama"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Kategori</Form.ControlLabel>
                  <Form.Control
                    name="category"
                    value={destinationForm.category}
                    placeholder="Masukkan Kategori"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Deskripsi</Form.ControlLabel>
                  <Form.Control
                    name="description"
                    value={destinationForm.description}
                    placeholder="Masukkan Deskripsi"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Area</Form.ControlLabel>
                  <Form.Control
                    name="indoorOutdoor"
                    value={destinationForm.indoorOutdoor}
                    placeholder="Masukkan Area"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Lokasi</Form.ControlLabel>
                  <Form.Control
                    name="location"
                    value={destinationForm.location}
                    placeholder="Masukkan Lokasi"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Jam Operasi</Form.ControlLabel>
                  <Form.Control
                    name="operatingHours"
                    value={destinationForm.operatingHours}
                    placeholder="Masukkan Jam Operasi"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Harga</Form.ControlLabel>
                  <Form.Control
                    name="price"
                    value={destinationForm.price}
                    placeholder="Masukkan Harga"
                    type="number"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Penilaian</Form.ControlLabel>
                  <Form.Control
                    name="ratings"
                    value={destinationForm.ratings}
                    placeholder="Masukkan Penilaian"
                    type="number"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>URL Gambar</Form.ControlLabel>
                  <Form.Control
                    name="imgurl"
                    value={destinationForm.imgurl}
                    placeholder="Masukkan URL Gambar"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>URL Website</Form.ControlLabel>
                  <Form.Control
                    name="websiteurl"
                    value={destinationForm.websiteurl}
                    placeholder="Masukkan URL Website"
                  />
                </Form.Group>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => { setShowAddModal(false); setDestinationForm(emptyForm) }} appearance="subtle">
              Cancel
            </Button>
            <Button onClick={addDestination} appearance="primary">
              Add Destination
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Destination Modal */}
        <Modal
          backdrop="static"
          open={showEditModal}
          onClose={() => { setShowEditModal(false); setDestinationForm(emptyForm) }}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Edit Destinasi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              fluid
              formValue={destinationForm}
              onChange={setDestinationForm}
            >
              <div className="flex flex-col gap-3">
                <Form.Group>
                  <Form.ControlLabel>Nama</Form.ControlLabel>
                  <Form.Control
                    name="name"
                    value={destinationForm.name}
                    placeholder="Masukkan Nama"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Kategori</Form.ControlLabel>
                  <Form.Control
                    name="category"
                    value={destinationForm.category}
                    placeholder="Masukkan Kategori"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Deskripsi</Form.ControlLabel>
                  <Form.Control
                    name="description"
                    value={destinationForm.description}
                    placeholder="Masukkan Deskripsi"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Area</Form.ControlLabel>
                  <Form.Control
                    name="indoorOutdoor"
                    value={destinationForm.indoorOutdoor}
                    placeholder="Masukkan Area"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Lokasi</Form.ControlLabel>
                  <Form.Control
                    name="location"
                    value={destinationForm.location}
                    placeholder="Masukkan Lokasi"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Jam Operasi</Form.ControlLabel>
                  <Form.Control
                    name="operatingHours"
                    value={destinationForm.operatingHours}
                    placeholder="Masukkan Jam Operasi"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Harga</Form.ControlLabel>
                  <Form.Control
                    name="price"
                    value={destinationForm.price}
                    placeholder="Masukkan Harga"
                    type="number"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Penilaian</Form.ControlLabel>
                  <Form.Control
                    name="ratings"
                    value={destinationForm.ratings}
                    placeholder="Masukkan Penilaian"
                    type="number"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>URL Gambar</Form.ControlLabel>
                  <Form.Control
                    name="imgurl"
                    value={destinationForm.imgurl}
                    placeholder="Masukkan URL Gambar"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>URL Website</Form.ControlLabel>
                  <Form.Control
                    name="websiteurl"
                    value={destinationForm.websiteurl}
                    placeholder="Masukkan URL Website"
                  />
                </Form.Group>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => { setShowEditModal(false); setDestinationForm(emptyForm) }} appearance="subtle">
              Cancel
            </Button>
            <Button onClick={editDestination} appearance="primary">
              Edit Destination
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}