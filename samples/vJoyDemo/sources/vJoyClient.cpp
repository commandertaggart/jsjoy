//////////////////////////////////////////////////////////////////////
// This console application demonstrates how to wrive a vJoy client
//
#include "stdafx.h"
#include "vjoyclient.h"
#include <malloc.h>

// Global
HANDLE hDevice = 0;


/*
Open vJoy device
The handle this function returns will be used as the means to communicate with the device
Return handle to open device or INVALID_HANDLE_VALUE 
*/
HANDLE OpenJoystickDevice(void)
{
	HANDLE hDevice;


	// At the moment vJoy is opened as DOS_FILE_NAME ("\\.\PPJoyIOCTL1") - ASCII only!
	_tprintf(_T("CreateFile:  %s\n"), DOS_FILE_NAME);
	hDevice = CreateFileA(DOS_FILE_NAME, GENERIC_WRITE | GENERIC_READ, FILE_SHARE_WRITE | FILE_SHARE_READ, NULL, OPEN_EXISTING, 0, NULL);
	if (hDevice == INVALID_HANDLE_VALUE)
	{
		//DWORD err = GetErrorString(ErrMsg,1000);
		//_tprintf(_T("[E=0x%x] CreateFile failed for %s with error: %s\n"), err, DOS_FILE_NAME, ErrMsg);
		return INVALID_HANDLE_VALUE;
	};
	return hDevice;
}



/* Helper Functions */
DWORD GetErrorString(TCHAR * Msg, int Size)
{
	TCHAR * s;
	DWORD errorcode = GetLastError();
	int nTChars = FormatMessageA(FORMAT_MESSAGE_ALLOCATE_BUFFER | FORMAT_MESSAGE_FROM_SYSTEM,  NULL, errorcode, 0, (LPSTR)&s,  0, (va_list*)NULL);
	if (!nTChars)
		return errorcode;

	_tcsncpy_s(Msg, Size, s, Size);
	LocalFree(s);
	return errorcode;
}

// ---------------------------------------------------------------------------------------------------------- \\
// Tests if vJoy device is installed 
// This call to the system requests installation information for the device by its ID (GUID_DEVINTERFACE_VJOY)
// It does not tests its functionality and it does not care if it is disabled.
BOOL isInstalled(void)
{
	HDEVINFO hDeviceInfo;
	hDeviceInfo = SetupDiGetClassDevs(&GUID_DEVINTERFACE_VJOY, NULL, NULL, DIGCF_PRESENT | DIGCF_INTERFACEDEVICE);
	if (hDeviceInfo == INVALID_HANDLE_VALUE)
	{
		//GetErrorString(ErrMsg,1000);
		//_tprintf(_T("[E] SetupDiGetClassDevs failed with error: %s\n"), ErrMsg);
		return FALSE;
	}
	else
		return TRUE;

}

	// ---------------------------------------------------------------------------------------------------------- \\
	// Opens vJoy device for writing
	// Returns a valid handle to the device if the device is responsive
BOOL openDevice(void)
{
	hDevice = OpenJoystickDevice();
	if (hDevice  == INVALID_HANDLE_VALUE)
		return FALSE;
	else
		return TRUE;

}

// ---------------------------------------------------------------------------------------------------------- \\
// Get the driver attributes (Vendor ID, Product ID, Version Number)
BOOL getDeviceAttrib(TCHAR * Msg)
{
	UINT	IoCode = LOAD_POSITIONS;
	UINT	IoSize = sizeof(JOYSTICK_POSITION);
	HID_DEVICE_ATTRIBUTES attrib;
	ULONG  bytes;

	attrib.Size = sizeof (HID_DEVICE_ATTRIBUTES);	// Prepare the buffer that gets the data
	IoCode = IOCTL_VJOY_GET_ATTRIB;					// The op-code for this request

	if (!Msg)
		return FALSE;

	// Now - access the device (vJoy) with the right op-code and get the data into the buffer (attrib)
	BOOL res = DeviceIoControl(hDevice, IoCode, NULL, 0, &(attrib), sizeof (HID_DEVICE_ATTRIBUTES), &bytes, NULL);
	if (!res)
	{
		_stprintf_s(Msg, MSG_SIZE, _T("[E] IOCTL_VJOY_GET_ATTRIB failed \r\n"));
		return FALSE;
	}
	else
	{
		_stprintf_s(Msg, MSG_SIZE, _T("[I] VendorID:0x%04X ProductID:0x%04X VersionNumber:%d\n"), attrib.VendorID,  attrib.ProductID, attrib.VersionNumber);
		return TRUE;
	};

}

// ---------------------------------------------------------------------------------------------------------- \\
// Update vJoy device position data
// Position includes (at the moment) Axes and Buttons
// Input: Pointer to data structure
void update_device(JOYSTICK_POSITION	* iReport)
{

	PVOID pPositionMessage;
	UINT	IoCode = LOAD_POSITIONS;
	UINT	IoSize = sizeof(JOYSTICK_POSITION);
	ULONG  bytes;

	// Sanity check
	if (!iReport) return;

	// Buffer hoding the joystick position (iReport) is ready
	// Cast it to PVOID
	pPositionMessage = (PVOID)(iReport);

	// Send joystick position structure to vJoy device
	DeviceIoControl (hDevice, IoCode, pPositionMessage, IoSize, NULL, 0, &bytes, NULL);

}
