import React, { useState, useEffect, useRef } from 'react'
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormTextarea,
  CButton,
  CButtonGroup,
} from '@coreui/react'
import { getCadanganById, updateCadangan } from 'src/service/cadangan/CadanganApi'

const CadanganEditor = ({ onEditorUpdated, onHandleRefreshData, ...props }) => {
  const [confirmText, setConfirmText] = useState('')
  const [visibleXL, setVisibleXL] = useState(false)
  const [visibleSM, setVisibleSM] = useState(false)
  
  const [data, setData] = useState({})
  const inputTindakan = useRef()

  useEffect(() => {
    async function loadData() {
      if(props.rowClickedInfo) {
        if(props.rowClickedInfo.visibleXL) {
          setVisibleXL(true)
          const cadanganData = await getCadanganById(props.rowClickedInfo.id)
          setData(cadanganData)
          inputTindakan.current.value = cadanganData.tindakanText
        }
      }
    }
    loadData()
  }, [props.rowClickedInfo])

  const confirmMove = (text) => {
    setVisibleXL(false)
    setVisibleSM(true)
    setConfirmText(text)
  }

  const moveTo = async () => {
    let cadanganTypeId = 0
    let updateIsOpen = false
    switch (confirmText) {
      case 'Cadangan':
        cadanganTypeId = 2
        updateIsOpen = true
        break
      case 'Aduan':
        cadanganTypeId = 3
        updateIsOpen = true
        break
      case 'Lain-lain':
        cadanganTypeId = 4
        updateIsOpen = true
        break
      case 'Selesai':
        cadanganTypeId = data.cadanganType.id
        updateIsOpen = false
        break
      default:
    }
    try {
      const updateTindakanText = inputTindakan.current ? inputTindakan.current.value : '';

      const updateData = {
        id: props.rowClickedInfo.id,
        cadanganType: { id: cadanganTypeId },
        isOpen: updateIsOpen,
        score: data.score,
        cadanganText: data.cadanganText,
        tindakanText: updateTindakanText,
        cadanganPhone: data.cadanganPhone,
        cadanganEmail: data.cadanganEmail,
        cadanganNama: data.cadanganNama,
        createDate: data.createDate
      }
  
      await updateCadangan(updateData, props.rowClickedInfo.id)
      setVisibleSM(false)
      resetModal()
      onEditorUpdated()
      onHandleRefreshData()
    } catch (error) {
      console.error(error)
    }
  }

  const resetModal = () => {
    setVisibleXL(false)
    props.rowClickedInfo.visibleXL = false
  }

  return (
    <>
      <CModal
        size="xl"
        visible={visibleXL}
        onClose={() => resetModal()}
        aria-labelledby="OptionalSizesExample1"
      >
        <CModalBody>
          <CForm id="cadanganEditorForm">
            <div className="mb-3">
              <CFormLabel htmlFor="txtNoHp">Tarikh: {new Date(data.createDate).toLocaleString('ms-MY')}</CFormLabel><br />
              <CFormLabel htmlFor="txtNama">Nama: {data.cadanganNama}</CFormLabel><br />
              <CFormLabel htmlFor="txtEmail">Email: {data.cadanganEmail}</CFormLabel><br />
              <CFormLabel htmlFor="txtNoHp">No telefon: {data.cadanganPhone}</CFormLabel><br />
              <CFormLabel htmlFor="txtNoHp">Penilaian: {data.score}</CFormLabel><br />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="txtKomen">Komen</CFormLabel>
              <CFormTextarea id="txtKomen" disabled rows={3} value={data.cadanganText}></CFormTextarea>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="txtTindakanMasjid">Tindakan Masjid</CFormLabel>
              <CFormTextarea ref={inputTindakan} id="txtTindakan" rows={3}></CFormTextarea>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="txtNoHp">Pindah ke&nbsp;&nbsp;&nbsp;</CFormLabel>
              <CButtonGroup role="group" aria-label="Move Button Group">
                <CButton color="primary" variant="outline" onClick={() => confirmMove('Cadangan')}>Cadangan</CButton>
                <CButton color="primary" variant="outline" onClick={() => confirmMove('Aduan')}>Aduan</CButton>
                <CButton color="primary" variant="outline" onClick={() => confirmMove('Lain-lain')}>Lain-lain</CButton>
                <CButton color="primary" variant="outline" onClick={() => confirmMove('Selesai')}>Selesai</CButton>
              </CButtonGroup>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => resetModal()}>
            Tutup
          </CButton>
          <CButton color="primary">
            Simpan
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        visible={visibleSM}
        onClick={() => {
          setVisibleXL(true)
          setVisibleSM(false)
        }}
        aria-labelledby="modalConfirm"
      >
        <CModalHeader>
          <h3>Pindah kes</h3>
        </CModalHeader>
        <CModalBody>
          <p>Adakah anda pasti untuk pindahkan kes ini ke bahagian <b>{confirmText}</b>?</p>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setVisibleXL(true)
              setVisibleSM(false)
            }}
          >
            Kembali
          </CButton>
          <CButton
            color="danger"
            onClick={() => moveTo()}
          >
            Ya
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default CadanganEditor
